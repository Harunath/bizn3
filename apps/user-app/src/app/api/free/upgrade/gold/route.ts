import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/auth";
import prisma, { UserMembershipType } from "@repo/db/client";

export const POST = async (req: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}

		const body = await req.json();

		const userDetails = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				homeClub: {
					select: {
						id: true,
						chapter: {
							select: {
								id: true,
								regionalFranchise: true,
								regionalFranchiseId: true,
							},
						},
					},
				},
			},
		});

		if (
			!userDetails ||
			!userDetails.homeClub ||
			!userDetails.homeClub.chapter ||
			!userDetails.homeClub.chapter.regionalFranchise
		) {
			return NextResponse.json(
				{ message: "Not a proper user" },
				{ status: 400 }
			);
		}

		const { paymentId, franchiseId } = body;
		if (!paymentId) {
			return NextResponse.json(
				{ message: "paymentId, requestedTier, categoryId are required" },
				{ status: 400 }
			);
		}

		const upgradeRequest = await prisma.upgradeRequest.create({
			data: {
				paymentId,
				requestedTier: UserMembershipType.GOLD,
				franchiseId,
				userId: session.user.id,
			},
		});

		return NextResponse.json(
			{ message: "success", data: upgradeRequest },
			{ status: 200 }
		);
	} catch (e) {
		console.error(e);
		return NextResponse.json(
			{ message: "Internal service error" },
			{ status: 500 }
		);
	}
};
