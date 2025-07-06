import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const slugs = await params;
		const id = slugs.id;
		const referral = await prisma.referral.findUnique({
			where: { id: id },
			include: {
				creator: {
					omit: {
						password: true,
					},
				},
				receiver: {
					omit: {
						password: true,
					},
				},
			},
		});

		if (!referral) {
			return NextResponse.json(
				{ message: "user do not exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "success", data: referral },
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
