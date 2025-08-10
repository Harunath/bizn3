"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import type {
	ProfileProps,
	ContactDetails,
} from "../../../lib/store/useUserStore";

type RefreshProfileResult =
	| { ok: true; user: ProfileProps; contactDetails: ContactDetails | null }
	| { ok: false; error: string };

export async function refreshProfile(): Promise<RefreshProfileResult> {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return { ok: false, error: "Not authenticated" };
	}

	const userId = session.user.id;

	const [user, contactDetails] = await Promise.all([
		prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				firstname: true,
				lastname: true,
				email: true,
				homeClubId: true,
				membershipType: true, // enum: UserMembershipType
				emailVerified: true,
				phone: true,
				phoneVerified: true,
				registrationCompleted: true,
				profileImage: true,
				deleted: true,
				deactivated: true,
				membershipStartDate: true,
				membershipEndDate: true,
				leadingChapterId: true,
				leadingClubId: true,
				createdAt: true,
				updatedAt: true,
				// include related BusinessDetails and shape it
				businessDetails: {
					select: {
						id: true,
						userId: true,
						businessName: true,
						images: true,
						panNumber: true,
						panNumberVerified: true,
						tanNumber: true,
						gstNumber: true,
						gstNumberVerified: true,
						verified: true,
						companyName: true,
						companyLogoUrl: true,
						gstRegisteredState: true,
						BusinessDescription: true, // matches your interface key
						keywords: true,
						generalCategory: true,
						categoryId: true,
						createdAt: true,
						updatedAt: true,
					},
				},
			},
		}),
		prisma.contactDetails.findUnique({
			where: { userId },
			select: {
				phone: true,
				createdAt: true,
				updatedAt: true,
				userId: true,
				mobile: true,
				website: true,
				links: true,
				houseNo: true,
				pager: true,
				voiceMail: true,
			},
		}),
	]);

	if (!user) return { ok: false, error: "User not found" };

	// Type assertion is safe because we shaped it to match ProfileProps exactly.
	return {
		ok: true,
		user: user as unknown as ProfileProps,
		contactDetails: (contactDetails as ContactDetails) ?? null,
	};
}
