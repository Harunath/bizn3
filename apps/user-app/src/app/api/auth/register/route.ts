import prisma, { UserMembershipType } from "@repo/db/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
	try {
		const body = await request.json();
		const { email, phone, password, firstname, lastname, otp, token } = body;
		console.log(
			email + "email",
			phone + " phone",
			password,
			"password",
			firstname,
			"firstname",
			lastname,
			"lastname",
			otp,
			"otp",
			token,
			"token"
		);
		if (otp) {
			const res = await fetch(
				`${process.env.NEXTAUTH_URL}/api/auth/verify-otp`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, otp, token, password }),
				}
			);
			const data = await res.json();
			if (data.success) {
				if (!email || !phone || !password || !firstname || !lastname) {
					return NextResponse.json({
						success: false,
						message: "All fields are required!",
					});
				}

				const startDate = new Date();
				const endDate = new Date(startDate);
				endDate.setFullYear(startDate.getFullYear() + 1);
				const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
				const admin = await prisma.user.create({
					data: {
						email,
						emailVerified: true,
						phone,
						password: hashedPassword,
						firstname,
						lastname,
						membershipType: UserMembershipType.FREE,
						membershipStartDate: startDate,
						membershipEndDate: endDate,
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
