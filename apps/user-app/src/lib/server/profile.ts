// lib/server/profile.ts
"use server";

import prisma from "@repo/db/client";
import type { UserMembershipType } from "@repo/db/client";

// Wire types = Dates as string (safe to serialize to client)
export interface BusinessDetailsWire {
	id: string;
	userId: string;
	businessName: string;
	images: string[];
	panNumber: string | null;
	panNumberVerified: boolean;
	tanNumber: string | null;
	gstNumber: string | null;
	gstNumberVerified: boolean;
	verified: boolean;
	companyName: string | null;
	companyLogoUrl: string | null;
	gstRegisteredState: string | null;
	BusinessDescription: string | null;
	keywords: string | null;
	generalCategory: string | null;
	categoryId: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ProfilePropsWire {
	id: string;
	firstname: string;
	lastname: string;
	email: string;
	homeClubId: string | null;
	membershipType: UserMembershipType;
	businessDetails: BusinessDetailsWire | null;

	emailVerified: boolean;
	phone: string;
	phoneVerified: boolean;
	registrationCompleted: boolean;
	profileImage: string | null;
	deleted: boolean;
	deactivated: boolean;
	membershipStartDate: string;
	membershipEndDate: string;

	leadingChapterId: string | null;
	leadingClubId: string | null;

	createdAt: string;
	updatedAt: string;
}

export interface ContactDetailsWire {
	phone: string | null;
	createdAt: string;
	updatedAt: string;
	userId: string;
	mobile: string | null;
	website: string | null;
	links: string[];
	houseNo: string | null;
	pager: string | null;
	voiceMail: string | null;
}

export async function getProfileByUserId(userId: string): Promise<{
	user: ProfilePropsWire | null;
	contactDetails: ContactDetailsWire | null;
}> {
	const [user, contact] = await Promise.all([
		prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				firstname: true,
				lastname: true,
				email: true,
				homeClubId: true,
				membershipType: true,
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
						BusinessDescription: true,
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

	// Cast Dates -> ISO strings for wire types
	const toISO = (d: Date | null | undefined) => (d ? d.toISOString() : null);

	const userWire: ProfilePropsWire | null = user
		? {
				...user,
				membershipStartDate: toISO(user.membershipStartDate)!,
				membershipEndDate: toISO(user.membershipEndDate)!,
				createdAt: user.createdAt.toISOString(),
				updatedAt: user.updatedAt.toISOString(),
				businessDetails: user.businessDetails
					? {
							...user.businessDetails,
							createdAt: user.businessDetails.createdAt.toISOString(),
							updatedAt: user.businessDetails.updatedAt.toISOString(),
						}
					: null,
			}
		: null;

	const contactWire: ContactDetailsWire | null = contact
		? {
				...contact,
				createdAt: contact.createdAt.toISOString(),
				updatedAt: contact.updatedAt.toISOString(),
			}
		: null;

	return { user: userWire, contactDetails: contactWire };
}
