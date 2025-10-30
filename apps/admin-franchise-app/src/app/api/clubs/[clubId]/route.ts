import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { FASessionOrThrow } from "../../../../lib/auth/Role";

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ clubId: string }> }
) => {
	try {
		await FASessionOrThrow();
		const { clubId } = await params;
		if (!clubId)
			return NextResponse.json({ error: "id is required" }, { status: 400 });
		const club = await prisma.club.findUnique({
			where: { id: clubId },
			select: {
				id: true,
				name: true,
				chapterId: true,
			},
		});
		if (!club)
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json({ ok: true, club });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
