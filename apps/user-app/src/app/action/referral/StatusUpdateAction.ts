// app/actions/requestActions.ts
"use server";

import prisma, { ReferralStatus } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function StatusUpdateAction(id: string, action: ReferralStatus) {
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		throw new Error("Unauthorized");
	}

	return prisma.referral.update({
		where: { id },
		data: {
			status: action,
		},
	});
}
