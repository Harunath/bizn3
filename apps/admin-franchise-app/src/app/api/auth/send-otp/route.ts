import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../../../../lib/nodemailer";
import prisma from "@repo/db/client";

const OTP_SECRET = process.env.OTP_SECRET || "supersecret";

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json({
				success: false,
				message: "Email is required!",
			});
		}

		// Check if email already exists and is verified

		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser?.emailVerified) {
			return NextResponse.json({
				success: false,
				message: "Email already verified!",
			});
		}

		// Generate 6-digit OTP
		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

		await prisma.gmailVerificationCode.upsert({
			where: { email },
			update: { code: otp, expiresAt },
			create: { email, code: otp, expiresAt },
		});

		// Create a JWT token that expires in 10 minutes
		const token = jwt.sign({ email, otp }, OTP_SECRET, { expiresIn: "10m" });

		// Send OTP email
		await sendVerificationEmail(email, otp);

		return NextResponse.json({ success: true, message: "OTP sent!", token });
	} catch (error) {
		if (error instanceof Error)
			return NextResponse.json({ success: false, error: error.message });
		return NextResponse.json({
			success: false,
			error: "internal server error",
		});
	}
}
