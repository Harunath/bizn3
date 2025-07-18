import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma, { PriorityType, ReferralStatus } from "@repo/db/client"; // adjust path
import { authOptions } from "../../../../lib/auth";

export const GET = async (req: Request) => {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);

		// Extract query parameters
		const statuses = searchParams.getAll("status"); // supports multiple ?status=ACCEPTED
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");

		const offset = (page - 1) * limit;

		if (!session || !session.user?.id || !session.user?.homeClub) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Build filter
		// Ensure statuses are of type ReferralStatus[]
		const validStatuses = statuses.filter((s) =>
			Object.values(ReferralStatus).includes(s as ReferralStatus)
		) as ReferralStatus[];

		const statusFilter =
			validStatuses.length > 0
				? { status: { in: validStatuses } }
				: { status: { not: ReferralStatus.COMPLETED } };

		const referrals = await prisma.referral.findMany({
			where: {
				receiverId: session.user.id,
				...statusFilter,
			},
			include: {
				creator: {
					select: {
						id: true,
						firstname: true,
						lastname: true,
						phone: true,
						profileImage: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			skip: offset,
			take: limit,
		});

		// Total count for pagination
		const total = await prisma.referral.count({
			where: {
				receiverId: session.user.id,
				...statusFilter,
			},
		});

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

export const POST = async (req: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user?.id || !session.user?.homeClub) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();

		const {
			receiverId,
			type, // SELF | THIRD_PARTY
			businessDetails,
			phone,
			Email,
			thirdPartyDetails, // only if THIRD_PARTY
			comments,
			priority,
		} = body;

		if (priority && !Object.values(PriorityType).includes(priority)) {
			return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
		}

		if (!receiverId || !type) {
			return NextResponse.json(
				{ error: "receiverId and type are required" },
				{ status: 400 }
			);
		}
		const homeClub = await prisma.club.findUnique({
			where: {
				id: session.user.homeClub,
			},
			select: {
				chapterId: true,
			},
		});

		const chapterId = homeClub?.chapterId;
		if (!chapterId) {
			// Handle error or empty result
			return NextResponse.json(
				{ error: "Could not find the chapter" },
				{ status: 400 }
			);
		}

		const user = await prisma.user.findUnique({
			where: {
				id: session.user.id,
			},
			select: {
				clubs: {
					select: {
						id: true,
					},
				},
			},
		});
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}
		const clubIds = user.clubs?.map((club) => club.id) || [];
		clubIds.push(session.user.homeClub);
		const isReceiverMember = await prisma.user.findFirst({
			where: {
				AND: [
					{ id: receiverId },
					{
						OR: [
							{
								membershipType: "VIP",
								homeClub: {
									chapterId,
								},
							},
							{
								homeClub: {
									chapterId,
								},
							},
							{
								clubs: {
									some: {
										id: { in: clubIds },
									},
								},
							},
						],
					},
				],
			},
		});
		if (!isReceiverMember) {
			return NextResponse.json(
				{ error: "Receiver is not a member of your club" },
				{ status: 400 }
			);
		}

		if (type === "THIRD_PARTY" && !thirdPartyDetails) {
			return NextResponse.json(
				{ error: "thirdPartyDetails required for THIRD_PARTY" },
				{ status: 400 }
			);
		}

		const referral = await prisma.referral.create({
			data: {
				type,
				creatorId: session.user.id,
				receiverId,
				businessDetails,
				phone,
				Email,
				thirdPartyDetails,
				comments,
				updates: [],
				priority: priority || PriorityType.LEVEL_1,
			},
		});

		return NextResponse.json(
			{ success: true, data: referral },
			{ status: 201 }
		);
	} catch (err) {
		console.error("Error creating referral:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
};
