import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/auth";
import prisma from "@repo/db/client";

export const POST = async () => {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				firstname: true,
				lastname: true,
				registrationCompleted: true,
				businessDetails: { select: { id: true } },
				homeClub: { select: { id: true } },
			},
		});

		if (!user) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		if (!user.businessDetails?.id || !user.homeClub?.id) {
			return NextResponse.json(
				{ message: "Missing business details or home club" },
				{ status: 400 }
			);
		}

		// Already completed registration
		if (user.registrationCompleted) {
			return NextResponse.json({
				message: `User ${user.firstname} ${user.lastname} already completed registration.`,
			});
		}

		await prisma.user.update({
			where: { id: user.id },
			data: { registrationCompleted: true },
		});

		return NextResponse.json({
			message: `User ${user.firstname} ${user.lastname}'s registration marked as completed.`,
		});
	} catch (error) {
		console.error("Error completing registration:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
