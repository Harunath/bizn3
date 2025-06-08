import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
// import verifyPhone from "@repo/common/verifyPhone";

export const POST = async (req: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);
		console.log(session, " user session");
		if (!session || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}
		const { phone } = await req.json();
		if (!phone) {
		}
		const res = await VerifyPhone({ phone });
		if (res) {
			return NextResponse.json(
				{ message: "success", data: "OTP is sent" },
				{ status: 200 }
			);
		} else {
			return NextResponse.json(
				{ message: "failed", data: "Failed to send OTP" },
				{ status: 400 }
			);
		}
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "internal service error" },
			{ status: 500 }
		);
	}
};

import twilio from "twilio";

const VerifyPhone = async ({ phone }: { phone: string }) => {
	try {
		const client = twilio(
			process.env.TWILIOACCOUNTSID!,
			process.env.TWILIOAUTHTOKEN!
		);
		console.log(process.env.TWILIOACCOUNTSID!, "process.env.TWILIOACCOUNTSID!");
		const verification = await client.verify.v2
			.services("VAc5c39348f2c2f03b6d813eab3973ce07")
			.verifications.create({ to: phone, channel: "sms" });

		console.log("Verification SID:", verification.sid);
		return true;
	} catch (error) {
		console.error("Twilio verification error:", error);
		return false;
	}
};
