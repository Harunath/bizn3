
import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export const GET = async () => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				email: true,
				emailVerified: true,
				phone: true,
				phoneVerified: true,
				registrationCompleted: true,
				password: true,
				firstname: true,
				lastname: true,
				bio: true,
				profileImage: true,
				address: true, // { street, city, state, zip }
				deleted: true,
				deactivated: true,
				businessDetails: true,
				membershipType: true,
				rsvp: true,
				attendance: true,

				// Membership Details
				membershipStartDate: true,
				membershipEndDate: true,

				// Club Memberships
				clubs: true,
				homeClubId: true,
				homeClub: true,

				createdAt: true,
				updatedAt: true,
			},
		});

		if (!user) {
			return NextResponse.json(
				{ message: "user do not exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "success", data: user },
			{ status: 200 }
		);
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "Internal service error" },
			{ status: 500 }
		);
	}
};
