import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import prisma from "@repo/db/client";
import { authOptions } from "../../../../lib/auth";

export const GET = async () => {
	try {
		const session = await getServerSession(authOptions);
		console.log(session, " user session");
		if (!session || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}
		const countries = await prisma.country.findMany();

		if (!countries || countries.length == 0) {
			return NextResponse.json(
				{ message: "Countries do not exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "success", data: countries },
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
