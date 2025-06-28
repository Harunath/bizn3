import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client"; // Adjust this path to your DB client location
import { authOptions } from "../../../../../lib/auth";
import { getServerSession } from "next-auth";

export const POST = async (req: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user?.id || !session.user?.homeClub) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const { finder } = await req.json();

		if (!finder || finder.trim().length < 2) {
			return NextResponse.json({ users: [] }); // Return empty list on short input
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

		const users = await prisma.user.findMany({
			where: {
				OR: [
					// VIP users
					{
						membershipType: "VIP",
						homeClub: {
							chapterId,
						},
					},
					// Users connected via homeClub
					{
						homeClub: {
							chapterId,
						},
					},
					// Users connected via any club memberships
					{
						clubs: {
							some: {
								id: session.user.homeClub,
							},
						},
					},
				],
				AND: [
					{
						OR: [
							{ firstname: { contains: finder, mode: "insensitive" } },
							{ lastname: { contains: finder, mode: "insensitive" } },
							{ email: { contains: finder, mode: "insensitive" } },
							{ phone: { contains: finder } },
						],
					},
				],
			},
			select: {
				id: true,
				firstname: true,
				lastname: true,
				email: true,
				phone: true,
				profileImage: true,
				businessDetails: {
					select: {
						businessName: true,
						generalCategory: true,
						category: true,
					},
				},
				homeClub: {
					select: {
						name: true,
						chapter: {
							select: {
								name: true,
							},
						},
					},
				},
			},
			orderBy: {
				membershipType: "desc", // VIPs will be prioritized if enum
			},
			take: 10,
		});
		return NextResponse.json({ data: users });
	} catch (error) {
		console.error("Error searching users:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
};
