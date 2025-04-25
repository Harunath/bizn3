import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/auth";

export const POST = async (request: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);
		console.log(session);
		if (!session || !session?.user || !session.user.isAdmin) {
			return NextResponse.json({ message: "unauthorized" }, { status: 403 });
		}
		const body = await request.json();
		const { name, code } = body;
		if (!name || !code) {
			return NextResponse.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		}
		const country = await prisma.country.create({
			data: {
				name: name,
				code: code,
				adminId: session.user.id,
				createdAt: new Date(),
			},
		});
		if (!country)
			return NextResponse.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		return NextResponse.json({ message: "success", country }, { status: 201 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
