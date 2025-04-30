// src/app/api/admin/available-franchises/route.ts
import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		console.log(session);
		if (!session || !session?.user || !session.user.isAdmin) {
			return NextResponse.json({ message: "unauthorized" }, { status: 403 });
		}
		const franchises = await prisma.franchise.findMany({
			where: {
				franchiseAdmin: null,
			},
			select: {
				id: true,
				businessName: true,
			},
		});
		if (!franchises)
			return NextResponse.json(
				{ message: "success", franchises: [] },
				{ status: 200 }
			);
		return NextResponse.json(
			{ message: "success", franchises },
			{ status: 200 }
		);
	} catch (error) {
		console.error("[FETCH_FRANCHISES_ERROR]", error);
		return NextResponse.json(
			{ message: "Failed to fetch franchises" },
			{ status: 500 }
		);
	}
}
