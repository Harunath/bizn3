import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@repo/db/client";
import { authOptions } from "../../../../../../lib/auth";

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const slugs = await params;
		const regionId = slugs.id;
		const session = await getServerSession(authOptions);
		console.log(session, " user session");
		if (!session || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}
		if (!regionId) {
			return NextResponse.json(
				{ message: "country id is needed" },
				{ status: 400 }
			);
		}

		const chapters = await prisma.chapter.findMany({
			where: {
				regionId: regionId,
			},
			select: {
				id: true,
				name: true,
				clubs: true,
			},
		});

		if (!chapters || chapters.length == 0) {
			return NextResponse.json(
				{ message: "chapters do not exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "success", data: chapters },
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
