import prisma, { FranchiseType } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/auth";

export const POST = async (request: NextRequest) => {
	try {
		console.log("hitting master-franchise/super-franchise - post");
		const session = await getServerSession(authOptions);
		console.log(session);
		if (
			!session ||
			!session?.user ||
			session.user.franchiseType != FranchiseType.MASTER_FRANCHISE
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
						country: {
							select: {
								id: true,
							},
						},
					},
				},
			},
		});
		if (!user || !user.franchise.country?.id) {
			return NextResponse.json(
				{ message: "country id does not exist" },
				{ status: 403 }
			);
		}
		const body = await request.json();
		const { name, code } = body;
		if (!name || !code) {
			return NextResponse.json(
				{ message: "name or code or both  not provided" },
				{ status: 400 }
			);
		}
		const zone = await prisma.zone.create({
			data: {
				name: name,
				code: code,
				parentFranchiseAdminId: session.user.id,
				countryId: user.franchise.country.id,
				createdAt: new Date(),
			},
		});
		if (!zone)
			return NextResponse.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		return NextResponse.json({ message: "success", zone }, { status: 201 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
