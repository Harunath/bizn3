// src/app/api/admin/available-franchises/route.ts
import { NextResponse } from "next/server";
import prisma, { FranchiseType } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (
			!session ||
			!session?.user ||
			session.user.franchiseType != FranchiseType.SUPER_FRANCHISE
		) {
			return NextResponse.json({ message: "unauthorized" }, { status: 403 });
		}
		const franchises = await prisma.franchise.findMany({
			where: {
				parentFranchiseAdminId: session.user.id,
			},
		});

		if (!franchises || franchises.length == 0) {
			return NextResponse.json(
				{ message: "free regions does not exist" },
				{ status: 400 }
			);
		}
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
