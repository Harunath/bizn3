import { FranchiseType } from "@prisma/client";
import { FASessionOrThrow } from "../../../../../lib/auth/Role";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";

export const POST = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const session = await FASessionOrThrow();
		if (session.user.franchiseType !== FranchiseType.REGIONAL_FRANCHISE) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		const { id } = await params;
		if (!id)
			return NextResponse.json({ error: "id is required" }, { status: 400 });
		const { clubId: homeClubId } = await req.json();
		if (!homeClubId)
			return NextResponse.json(
				{ error: "homeClubId is required" },
				{ status: 400 }
			);
		const homeClub = await prisma.club.findUnique({
			where: { id: homeClubId },
			select: {
				id: true,
				chapter: { select: { parentFranchiseAdminId: true } },
			},
		});
		if (
			!homeClub ||
			!homeClub.chapter ||
			!homeClub.chapter.parentFranchiseAdminId
		)
			return NextResponse.json(
				{ error: "Invalid homeClubId" },
				{ status: 400 }
			);
		if (session.user.id !== homeClub.chapter.parentFranchiseAdminId) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		const user = await prisma.user.update({
			where: { id },
			data: { homeClubId },
			select: { id: true, homeClubId: true },
		});
		return NextResponse.json({ ok: true, user });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
