import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";

export const POST = async (req: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}
		const body = await req.json();
		const { homeClubId } = body;
		if (!homeClubId) {
			return NextResponse.json(
				{ message: "homeClubId is required" },
				{ status: 400 }
			);
		}
		const club = await prisma.club.findUnique({
			where: { id: homeClubId },
		});
		if (!club) {
			return NextResponse.json(
				{ message: "Club do not exist" },
				{ status: 404 }
			);
		}
		const user = await prisma.user.update({
			where: {
				id: session.user.id,
			},
			data: {
				homeClubId,
				registrationCompleted: true,
			},
			select: {
				homeClubId: true,
				registrationCompleted: true,
				membershipType: true,
				businessDetails: {
					select: {
						id: true,
					},
				},
			},
		});
		if (!user || !user.businessDetails?.id || !user.homeClubId)
			return NextResponse.json(
				{
					message: "failed",
				},
				{ status: 400 }
			);
		return NextResponse.json({
			message: "success",
			updatedUser: {
				homeClub: user.homeClubId,
				registrationCompleted: user.registrationCompleted,
				businessId: user.businessDetails?.id,
				membershipType: user.membershipType,
			},
		});
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "Internal service error" },
			{ status: 500 }
		);
	}
};
