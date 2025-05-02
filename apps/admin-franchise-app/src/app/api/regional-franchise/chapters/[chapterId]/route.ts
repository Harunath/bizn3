import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ chapterId: string }> }
) {
	try {
		const { chapterId } = await params;

		if (!chapterId) {
			return NextResponse.json(
				{ message: "chapterId is missing" },
				{ status: 400 }
			);
		}
		console.log(chapterId, " chapterId");
		const chapter = await prisma.chapter.findUnique({
			where: {
				id: chapterId,
			},
			include: {
				region: true,
				clubs: true,
			},
		});
		console.log(chapter, " chapter");
		if (!chapter) {
			return NextResponse.json(
				{ message: "Chapter do not exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "success", data: chapter },
			{ status: 200 }
		);
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "Internal Service Error" },
			{ status: 500 }
		);
	}
}
