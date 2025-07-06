import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const slugs = await params;
		const id = slugs.id;
		const user = await prisma.user.findUnique({
			where: { id: id },
			select: {
				id: true,
				email: true,
				phone: true,
				firstname: true,
				lastname: true,
				profileImage: true,

				personalDetails: true,
				contactDetails: true,
				fullAddress: true,
			},
		});

		if (!user) {
			return NextResponse.json(
				{ message: "user do not exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "success", data: user },
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
