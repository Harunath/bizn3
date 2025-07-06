import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/auth";
import prisma, { OrderStatus, UserMembershipType } from "@repo/db/client";

import { z } from "zod";

interface OrderItemDetailsSnapshot {
	userId: string;
	franchiseId: string;
	clubs: string[];
}

function parseItemDetailsSnapshot(
	snapshot: unknown
): OrderItemDetailsSnapshot | null {
	if (!snapshot) return null;

	try {
		if (typeof snapshot === "string") {
			return JSON.parse(snapshot) as OrderItemDetailsSnapshot;
		} else if (typeof snapshot === "object") {
			return snapshot as OrderItemDetailsSnapshot;
		}
	} catch (error) {
		console.error("Failed to parse itemDetailsSnapshot:", error);
	}

	return null;
}

const upgradeSchema = z.object({
	paymentId: z.string().min(1),
});

export const POST = async (req: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}

		const userDetails = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				membershipType: true,
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
		console.log(userDetails);
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
		if (userDetails.membershipType != UserMembershipType.FREE) {
			return NextResponse.json(
				{ message: "User tier must be free" },
				{ status: 400 }
			);
		}

		const body = await req.json();
		console.log(body);
		const parseResult = upgradeSchema.safeParse(body);

		if (!parseResult.success) {
			return NextResponse.json(
				{ message: "Invalid input", errors: parseResult.error.errors },
				{ status: 400 }
			);
		}

		const { paymentId } = parseResult.data;

		const order = await prisma.order.findUnique({
			where: { cashfreeOrderId: paymentId },
			include: { payments: true },
		});
		if (!order) {
			return NextResponse.json({ message: "Order not found" }, { status: 404 });
		}
		if (order.status != OrderStatus.PAID) {
			return NextResponse.json(
				{ message: "Order status is not paid" },
				{ status: 400 }
			);
		}
		const itemDetailsSnapshot = parseItemDetailsSnapshot(
			order.itemDetailsSnapshot
		);

		if (!itemDetailsSnapshot) {
			return NextResponse.json(
				{ message: "Order has the inconsistent data" },
				{ status: 400 }
			);
		}

		if (itemDetailsSnapshot.clubs.length > 4) {
			return NextResponse.json(
				{
					message: "More than 4 clubs are selected. Please select only 4 clubs",
				},
				{ status: 400 }
			);
		}
		const alreadyRequested = await prisma.upgradeRequest.findFirst({
			where: {
				userId: session.user.id,
				requestedTier: UserMembershipType.GOLD,
				clubIds: { equals: itemDetailsSnapshot.clubs },
			},
		});

		if (alreadyRequested) {
			return NextResponse.json(
				{ message: "Request already submitted" },
				{ status: 409 }
			);
		}

		if (
			!Array.isArray(itemDetailsSnapshot.clubs) ||
			itemDetailsSnapshot.clubs.length > 4 ||
			!itemDetailsSnapshot.clubs.every((id) => typeof id === "string")
		) {
			return NextResponse.json(
				{ message: "Clubs must be an array of 4 strings" },
				{ status: 400 }
			);
		}

		const existClubs = await prisma.club.findMany({
			where: {
				id: { in: itemDetailsSnapshot.clubs },
			},
		});
		if (existClubs.length != 4) {
			return NextResponse.json(
				{ message: "choose existing Clubs" },
				{ status: 400 }
			);
		}

		const upgradeRequest = await prisma.upgradeRequest.create({
			data: {
				paymentId: order.payments[order.payments.length - 1]?.id,
				requestedTier: UserMembershipType.GOLD,
				franchiseId: userDetails.homeClub.chapter.regionalFranchise.id,
				userId: session.user.id,
				clubIds: itemDetailsSnapshot.clubs,
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
