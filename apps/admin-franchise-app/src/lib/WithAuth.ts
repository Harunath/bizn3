// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextRequest } from "next/server";
import prisma, { FranchiseType } from "@repo/db/client";

type Role = FranchiseType;

export async function checkAuth(req: NextRequest, permittedRoles: Role[]) {
	const session = await getServerSession(authOptions);

	if (!session || !session.user?.id) {
		throw new Error("Unauthorized");
	}

	const user = await prisma.franchiseAdmin.findUnique({
		where: { id: session.user.id },
		select: {
			id: true,
			firstName: true,
			lastName: true,
			franchise: {
				select: {
					franchiseType: true,
				},
			},
		},
	});

	if (!user) {
		throw new Error("UserNotFound");
	}

	if (!permittedRoles.includes(user.franchise.franchiseType)) {
		throw new Error("Forbidden");
	}

	return user; // ✅ Return the user if authorized
}
