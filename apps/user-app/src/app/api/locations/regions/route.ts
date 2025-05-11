import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@repo/db/client";
import { authOptions } from "../../../../lib/auth";

export const GET = async (req: NextRequest) => {
	try {
		const searchParams = req.nextUrl.searchParams;
		const id = searchParams.get("id");
		const session = await getServerSession(authOptions);
		console.log(session, " user session");
		if (!session || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}
		if (!id) {
			return NextResponse.json(
				{ message: "zone id is needed" },
				{ status: 400 }
			);
		}
		const regions = await prisma.region.findMany({
			where: {
				zoneId: id,
			},
		});

		if (!regions || regions.length == 0) {
			return NextResponse.json(
				{ message: "regions do not exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "success", data: regions },
			{ status: 200 }
		);
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "Internal service error" },
			{ status: 500 }
		);
	}
};
