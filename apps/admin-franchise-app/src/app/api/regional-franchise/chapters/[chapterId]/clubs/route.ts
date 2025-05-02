import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../../lib/auth";
import prisma from "@repo/db/client";

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
		const session = await getServerSession(authOptions);
		if (!session || !session.user || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 403 });
		}
		const chapter = await prisma.chapter.findUnique({
			where: {
				id: chapterId,
			},
		});
		if (!chapter) {
			return NextResponse.json(
				{ message: "chapter do not exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "success", data: chapter },
			{ status: 500 }
		);
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "Internal Service Error" },
			{ status: 500 }
		);
	}
}

export async function POST(
	req: NextRequest,
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
		const session = await getServerSession(authOptions);
		if (!session || !session.user || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 403 });
		}
		const body = await req.json();
		const { name, code } = body;
		if (!name || !code) {
			return NextResponse.json(
				{ message: "name or code are missing" },
				{ status: 400 }
			);
		}
		const chapter = await prisma.chapter.findUnique({
			where: {
				id: chapterId,
			},
		});
		if (!chapter) {
			return NextResponse.json(
				{ message: "chapter do not exist" },
				{ status: 400 }
			);
		}
		const club = await prisma.club.create({
			data: {
				name,
				code,
				chapterId,
				FAcreatorId: session.user.id,
			},
		});
		return NextResponse.json(
			{ message: "success", data: club },
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
