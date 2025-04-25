import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";

export const POST = async (request: NextRequest) => {
	try {
		const body = await request.json();
		const { email, phone, password, firstName, lastName, otp, token } = body;
		console.log(password, " password", otp, " otp");
		if (otp) {
			const res = await fetch("http://localhost:3001/api/auth/verify-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, otp, token }),
			});
			const data = await res.json();
			if (data.success) {
				if (!email && !phone && !password && !firstName && !lastName) {
					return NextResponse.json({
						success: false,
						message: "All fields are required!",
					});
				}
				const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
				const admin = await prisma.admin.create({
					data: {
						email,
						emailVerified: true,
						phone,
						phoneVerified: true,
						password: hashedPassword,
						firstName,
						lastName,
					},
				});
				if (admin.id)
					return NextResponse.json({
						success: true,
						message: "Successfully created admin",
					});
				else {
					return NextResponse.json({
						success: false,
						message: "Something went wrong!",
					});
				}
			}
		}
	} catch (error) {
		console.error("Error verifying email:", error);
		return NextResponse.json({
			success: false,
			error: "OTP expired or invalid!",
		});
	}
};
