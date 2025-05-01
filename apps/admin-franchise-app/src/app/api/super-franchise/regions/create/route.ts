import prisma, { FranchiseType } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/auth";

export const POST = async (request: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);
		console.log(session);
		if (
			!session ||
			!session?.user ||
			session.user.franchiseType != FranchiseType.SUPER_FRANCHISE
		) {
			return NextResponse.json({ message: "unauthorized" }, { status: 403 });
		}
		const user = await prisma.franchiseAdmin.findUnique({
			where: {
				id: session.user.id,
			},
			select: {
				franchise: {
					select: {
						zoneId: true,
					},
				},
			},
		});
		if (!user || !user.franchise.zoneId) {
			return NextResponse.json(
				{ message: "country id does not exist" },
				{ status: 403 }
			);
		}
		const body = await request.json();
		const { name, code } = body;
		if (!name || !code) {
			return NextResponse.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		}
		const region = await prisma.region.create({
			data: {
				name: name as string,
				code: code as string,
				zoneId: user.franchise.zoneId,
				parentFranchiseAdminId: session.user.id,
				createdAt: new Date(),
			},
		});
		if (!region)
			return NextResponse.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		return NextResponse.json({ message: "success", region }, { status: 201 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
