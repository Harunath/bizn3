import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../../../lib/auth";
import prisma from "@repo/db/client";

export const GET = async () => {
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
								name: true,
								clubs: true,
							},
						},
					},
				},
			},
		});

		const chapter = userDetails?.homeClub?.chapter;
		const clubs = userDetails?.homeClub?.chapter?.clubs;
		if (!clubs) {
			return NextResponse.json({ message: "No clubs found" }, { status: 404 });
		}
		return NextResponse.json(
			{
				message: "success",
				data: { clubs, chapter: { id: chapter?.id, name: chapter?.name } },
			},
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
