import { NextRequest, NextResponse } from "next/server";
import prisma, { UserMembershipType } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../lib/auth";

export const POST = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user || !session.user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const param = await params;
		const id = param.id;
		const body = await req.json();
		const { action } = body;

		if (!action) {
			return NextResponse.json({ error: "Invalid request" }, { status: 400 });
		}

		if (!["APPROVED", "REJECTED"].includes(action)) {
			return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}

		const upgradeRequest = await prisma.upgradeRequest.findUnique({
			where: { id },
			include: { user: true },
		});

		if (!upgradeRequest) {
			return NextResponse.json(
				{ error: "Upgrade request not found" },
				{ status: 404 }
			);
		}

		if (upgradeRequest.status !== "PENDING") {
			return NextResponse.json(
				{ error: "Request already processed" },
				{ status: 400 }
			);
		}

		const updates = {
			status: action,
			reviewedAt: new Date(),
		};
		const userUpdates: {
			membershipType?: UserMembershipType;
			membershipStartDate?: Date;
			membershipEndDate?: Date;
		} = {};
		if (action === "APPROVED") {
			const now = new Date();
			const endDate = new Date();
			endDate.setMonth(endDate.getMonth() + 12); // 1 year membership
			userUpdates.membershipType =
				upgradeRequest.requestedTier as UserMembershipType;
			userUpdates.membershipStartDate = now;
			userUpdates.membershipEndDate = endDate;
		}

		// Optional logic based on type
		if (upgradeRequest.requestedTier === UserMembershipType.GOLD) {
			if (!upgradeRequest.clubIds || upgradeRequest.clubIds.length === 0) {
				return NextResponse.json(
					{ error: "Club IDs required for GOLD membership" },
					{ status: 400 }
				);
			}
			// You can optionally assign user to those clubs here
			await prisma.$transaction([
				prisma.upgradeRequest.update({
					where: { id },
					data: updates,
				}),
				...(action === "APPROVED"
					? [
							prisma.user.update({
								where: { id: upgradeRequest.userId },
								data: {
									...userUpdates,
									clubs: {
										set: upgradeRequest.clubIds.map((clubId: string) => ({
											id: clubId,
										})),
									},
								},
							}),
						]
					: []),
			]);

			return NextResponse.json({ success: true });
		}

		if (upgradeRequest.requestedTier === UserMembershipType.VIP) {
			if (!upgradeRequest.chapterId || !upgradeRequest.categoryId) {
				return NextResponse.json(
					{ error: "ChapterId and CategoryId required for VIP" },
					{ status: 400 }
				);
			}
			// Optional: Assign to category/chapter here
			await prisma.$transaction([
				prisma.upgradeRequest.update({
					where: { id },
					data: updates,
				}),
				...(action === "APPROVED"
					? [
							prisma.user.update({
								where: { id: upgradeRequest.userId },
								data: {
									...userUpdates,
									businessDetails: {
										update: { categoryId: upgradeRequest.categoryId },
									},
								},
							}),
						]
					: []),
			]);

			return NextResponse.json({ success: true });
		}
	} catch (err) {
		console.error("Error processing upgrade:", err);
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		);
	}
};
