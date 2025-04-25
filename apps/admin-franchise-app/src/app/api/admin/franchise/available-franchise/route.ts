// src/app/api/admin/available-franchises/route.ts
import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function GET() {
	try {
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
