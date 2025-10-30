import { NextResponse } from "next/server";
import { FASessionOrThrow } from "../../../lib/auth/Role";
import prisma from "@repo/db/client";

export const GET = async () => {
	try {
		await FASessionOrThrow();

		const clubs = await prisma.club.findMany({
			select: {
				id: true,
				name: true,
				chapterId: true,
				chapter: { select: { name: true, id: true } },
			},
		});
		if (!clubs)
			return NextResponse.json({ error: "Not found" }, { status: 404 });

		return NextResponse.json({ ok: true, clubs });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
