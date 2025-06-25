// app/api/upgrade-requests/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma, { FranchiseType } from "@repo/db/client"; // adjust path to your prisma client
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export const GET = async (req: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);

		const skip = (page - 1) * limit;
		// ✅ Optional: Protect access
		if (
			!session ||
			!session.user ||
			!session.user.id ||
			session.user.franchiseType != FranchiseType.REGIONAL_FRANCHISE
		) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const user = await prisma.franchiseAdmin.findUnique({
			where: {
				id: session.user.id,
			},
		});

		if (!user || !user.franchiseId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const requests = await prisma.upgradeRequest.findMany({
			where: {
				franchiseId: user?.franchiseId,
			},
			include: {
				user: true,
				paymentDetails: true,
				reviewedBy: true,
			},
			orderBy: {
				createdAt: "desc",
			},
			skip,
			take: limit,
		});

		return NextResponse.json({ message: "success", data: requests });
	} catch (error) {
		console.error("[GET_UPGRADE_REQUESTS]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
