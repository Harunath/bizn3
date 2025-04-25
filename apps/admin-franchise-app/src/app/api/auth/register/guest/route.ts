import prisma from "@repo/db/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
	try {
		const body = await request.json();
		const {
			selectedFranchiseType,
			email,
			phone,
			password,
			firstName,
			lastName,
			otp,
			token,
			nomineeName,
			nomineeRelation,
			nomineeContact,
			franchiseId,
		} = body;

		if (otp) {
			const res = await fetch("http://localhost:3001/api/auth/verify-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, otp, token, password }),
			});
			const data = await res.json();
			if (data.success) {
				if (
					!selectedFranchiseType ||
					!franchiseId ||
					!email ||
					!phone ||
					!password ||
					!firstName ||
					!lastName ||
					!nomineeName ||
					!nomineeRelation ||
					!nomineeContact ||
					!franchiseId
				) {
					return NextResponse.json({
						success: false,
						message: "All fields are required!",
					});
				}
				const franchise = await prisma.franchise.findUnique({
					where: { id: franchiseId },
				});
				if (!franchise || franchise.franchiseType != selectedFranchiseType)
					return NextResponse.json(
						{ message: "wrong franchise data" },
						{ status: 400 }
					);
				const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
				const admin = await prisma.franchiseAdmin.create({
					data: {
						email,
						emailVerified: true,
						phone,
						password: hashedPassword,
						firstName,
						lastName,
						nomineeName,
						nomineeRelation,
						nomineeContact,
						franchiseId,
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
