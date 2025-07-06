import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import bcrypt from "bcryptjs";

export const POST = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const slugs = await params;
		const userId = slugs.id;
		const { oldPassword, newPassword } = await req.json();
		if (!oldPassword || !newPassword) {
			return NextResponse.json(
				{
					message: "failed",
					errors: "Passwords not found",
				},
				{ status: 400 }
			);
		}
		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			return NextResponse.json(
				{
					message: "failed",
					errors: "User not found",
				},
				{ status: 400 }
			);
		}
		const isValidPassword = await bcrypt.compare(oldPassword, user.password);
		if (!isValidPassword) {
			return NextResponse.json(
				{
					message: "failed",
					errors: "Old password did not match",
				},
				{ status: 400 }
			);
		}
		const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is the salt rounds

		await prisma.user.update({
			where: { id: userId },
			data: { password: hashedPassword },
		});
		return NextResponse.json(
			{
				message: "success",
				data: "Password is updated",
			},
			{ status: 201 }
		);
	} catch (e) {
		console.error("Error updating Password:", e);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
