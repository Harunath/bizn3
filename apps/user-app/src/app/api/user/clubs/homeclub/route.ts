import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";

export const POST = async (req: NextRequest) => {
	try {
		console.log("hitting api/user/clubs");
		console.log(authOptions);
		const session = await getServerSession(authOptions);
		if (!session || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}
		const body = await req.json();
		console.log(body);
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
			},
		});
		return NextResponse.json(
			{ message: "success", data: user.homeClubId },
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
