import { NextRequest, NextResponse } from "next/server";
import prisma, { ReferralStatus } from "@repo/db/client";

export const POST = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const slugs = await params;
		const id = slugs.id;
		const { action } = await req.json();
		let RAction;
		if (action == "ACCEPTED") {
			RAction = ReferralStatus.ACCEPTED;
		} else {
			RAction = ReferralStatus.REJECTED;
		}
		const referral = await prisma.referral.update({
			where: { id: id },
			data: {
				status: RAction,
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
