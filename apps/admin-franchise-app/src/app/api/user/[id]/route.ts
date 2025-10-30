import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@repo/db/client";
import { FASessionOrThrow } from "../../../../lib/auth/Role";

const updateUserSchema = z.object({
	homeClubId: z.string().cuid().optional(),
	firstname: z.string().min(1).optional(),
	lastname: z.string().min(1).optional(),
	email: z.string().email().optional(),
	phone: z.string().min(7).optional(),
	membershipType: z.enum(["FREE", "GOLD", "VIP"]).optional(),
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
	if (data.homeClubId) {
		const club = await prisma.club.findUnique({
			where: { id: data.homeClubId },
			select: { id: true },
		});
		if (!club) {
			return NextResponse.json(
				{ error: "Invalid homeClubId" },
				{ status: 400 }
			);
		}
	}
	const user = await prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			firstname: true,
			email: true,
			phone: true,
			membershipType: true,
			homeClubId: true,
		},
	});
	if (!user)
		return NextResponse.json({ error: "User not found" }, { status: 404 });

	const updated = await prisma.user.update({
		where: { id },
		data: {
			firstname: data.firstname ? data.firstname : user.firstname,
			email: data.email ? data.email : user.email,
			phone: data.phone ? data.phone : user.phone,
			membershipType: data.membershipType
				? data.membershipType
				: user.membershipType,
			homeClubId: data.homeClubId ? data.homeClubId : user.homeClubId,
		},
	});

	return NextResponse.json({ ok: true, id: updated.id });
}
