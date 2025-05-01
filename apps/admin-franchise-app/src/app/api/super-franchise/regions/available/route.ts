import prisma from "@repo/db/client";
import { NextResponse } from "next/server";

export const GET = async () => {
	try {
		const regions = await prisma.region.findMany({
			where: { regionalFranchise: null },
		});
		if (regions.length > 0) {
			return NextResponse.json(
				{ message: "success", regions },
				{ status: 200 }
			);
		}
		return NextResponse.json({ message: "no regions exist" }, { status: 200 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "internal server error" },
			{ status: 500 }
		);
	}
};
