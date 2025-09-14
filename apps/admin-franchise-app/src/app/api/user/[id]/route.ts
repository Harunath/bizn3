import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@repo/db/client";
import { FASessionOrThrow } from "../../../../lib/auth/Role";

const updateUserSchema = z.object({
	homeClubId: z.string().cuid(),
});

export async function GET(
	_: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	await FASessionOrThrow();
	const { id } = await params;
	if (!id)
		return NextResponse.json({ error: "id is required" }, { status: 400 });
	const user = await prisma.user.findUnique({
		where: { id },
		include: {
			personalDetails: true,
			businessDetails: true,
			homeClub: true,
			clubs: true,
		},
		omit: { password: true },
	});
	if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

	return Response.json({
		ok: true,
		user,
	});
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	await FASessionOrThrow();
	const { id } = await params;
	if (!id)
		return NextResponse.json({ error: "id is required" }, { status: 400 });
	const body = await req.json();
	const data = updateUserSchema.parse(body);

	const updated = await prisma.user.update({
		where: { id },
		data,
		select: { id: true },
	});

	return NextResponse.json({ ok: true, id: updated.id });
}
