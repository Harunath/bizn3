// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import prisma from "@repo/db/client";

export async function checkAuth() {
	const session = await getServerSession(authOptions);

	if (!session || !session.user?.id) {
		throw new Error("Unauthorized");
	}

	const user = await prisma.admin.findUnique({
		where: { id: session.user.id },
		select: {
			id: true,
			firstName: true,
			lastName: true,
		},
	});

	if (!user) {
		throw new Error("UserNotFound");
	}

	return user; // ✅ Return the user if authorized
}
