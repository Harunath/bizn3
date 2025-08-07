import { NextResponse } from "next/server";
import prisma, { ReferralStatus } from "@repo/db/client";
import { authOptions } from "../../../../../lib/auth";
import { getServerSession } from "next-auth";

export const GET = async (req: Request) => {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const statuses = searchParams.getAll("status");
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const offset = (page - 1) * limit;

		// Filter only valid statuses
		const validStatuses = statuses.filter((s) =>
			Object.values(ReferralStatus).includes(s as ReferralStatus)
		) as ReferralStatus[];

		const statusFilter =
			validStatuses.length > 0
				? { status: { in: validStatuses } }
				: { status: { not: ReferralStatus.COMPLETED } };

		const referrals = await prisma.referral.findMany({
			where: {
				creatorId: session.user.id,
				...statusFilter,
			},
			include: {
				receiver: {
					select: {
						id: true,
						firstname: true,
						lastname: true,
						phone: true,
						profileImage: true,
					},
				},
				thankYouNote: true,
			},
			orderBy: {
				createdAt: "desc",
			},
			skip: offset,
			take: limit,
		});

		const total = await prisma.referral.count({
			where: {
				creatorId: session.user.id,
				...statusFilter,
			},
		});
		console.log("referrals :", referrals);
		return NextResponse.json(
			{
				success: true,
				data: referrals,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
				},
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error("Error fetching referrals:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
};
