import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
// import verifyPhoneCheck from "@repo/common/verifyPhoneCheck";

export const POST = async (req: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);
		console.log(session, " user session");
		if (!session || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}
		const { phone, code } = await req.json();
		if (!phone) {
		}
		const res = await VerifyPhoneCheck({ phone, code });
		if (res) {
			await prisma.user.update({
				where: {
					id: session.user.id,
				},
				data: { phoneVerified: true },
			});
			return NextResponse.json(
				{ message: "success", data: "Phone verified successfully" },
				{ status: 200 }
			);
		} else {
			return NextResponse.json(
				{ message: "failed", data: "failed" },
				{ status: 200 }
			);
		}
	} catch (e) {
		console.log(e);
		NextResponse.json({ message: "internal service error" }, { status: 500 });
	}
};

import twilio from "twilio";
import prisma from "@repo/db/client";

const VerifyPhoneCheck = async ({
	phone,
	code,
}: {
	phone: string;
	code: string;
}) => {
	try {
		const client = twilio(
			process.env.TWILIOACCOUNTSID,
			process.env.TWILIOAUTHTOKEN
		);

		const verification = await client.verify.v2
			.services("VAc5c39348f2c2f03b6d813eab3973ce07")
			.verificationChecks.create({ to: phone, code: code });

		console.log(verification.status);
		if (verification.status == "approved") return verification.valid;
		return false;
	} catch (error) {
		console.error("Twilio verification error:", error);
		return false;
	}
};
