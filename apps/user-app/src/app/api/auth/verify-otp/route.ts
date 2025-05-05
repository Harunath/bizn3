import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const OTP_SECRET = process.env.OTP_SECRET || "supersecret";

export async function POST(req: Request) {
	try {
		const { email, otp, token } = await req.json();
		console.log(email, " email", otp, " otp", token, " token");

		if (!email || !otp || !token) {
			return NextResponse.json({
				success: false,
				message: "All fields are required!",
			});
		}

		// Verify the JWT token
		const decoded = jwt.verify(token, OTP_SECRET) as {
			email: string;
			otp: string;
		};

		if (decoded.email !== email || decoded.otp !== otp) {
			return NextResponse.json({ success: false, message: "Invalid OTP!" });
		}
		return NextResponse.json({ success: true, message: "Email verified!" });
	} catch (error) {
		console.error("Error verifying email:", error);
		return NextResponse.json({
			success: false,
			error: "OTP expired or invalid!",
		});
	}
}
