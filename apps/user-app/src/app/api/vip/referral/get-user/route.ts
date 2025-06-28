import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client"; // Adjust this path to your DB client location

export const POST = async (req: NextRequest) => {
	try {
		const { finder } = await req.json();

		if (!finder || finder.trim().length < 2) {
			return NextResponse.json({ users: [] }); // Return empty list on short input
		}

		const users = await prisma.user.findMany({
			where: {
				OR: [
					{ firstname: { contains: finder, mode: "insensitive" } },
					{ lastname: { contains: finder, mode: "insensitive" } },
					{ email: { contains: finder, mode: "insensitive" } },
					{ phone: { contains: finder } },
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
					select: { businessName: true, generalCategory: true, category: true },
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
			take: 10, // limit results to 10 users
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
