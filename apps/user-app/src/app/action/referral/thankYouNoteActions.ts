// app/actions/thankYouNoteActions.ts
"use server";

import prisma, { ThankYouNoteBusinessType } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

type ThankYouNoteInput = {
	referralId: string;
	amount: string;
	businessType: ThankYouNoteBusinessType;
	comment: string;
};

export async function upsertThankYouNoteAction(data: ThankYouNoteInput) {
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		throw new Error("Unauthorized");
	}

	const senderId = session.user.id;

	// Get the referral to get receiverId
	const referral = await prisma.referral.findUnique({
		where: { id: data.referralId },
		select: { receiverId: true },
	});

	if (!referral) throw new Error("Referral not found");

	return prisma.thankYouNote.upsert({
		where: {
			referralId: data.referralId,
		},
		update: {
			amount: data.amount,
			businessType: data.businessType,
			comment: data.comment,
		},
		create: {
			referralId: data.referralId,
			senderId: senderId,
			receiverId: referral.receiverId,
			amount: data.amount,
			businessType: data.businessType,
			comment: data.comment,
		},
	});
}

// app/actions/thankYouNoteActions.ts
export async function getThankYouNoteByReferralId(referralId: string) {
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		throw new Error("Unauthorized");
	}

	return prisma.thankYouNote.findUnique({
		where: { referralId },
	});
}
