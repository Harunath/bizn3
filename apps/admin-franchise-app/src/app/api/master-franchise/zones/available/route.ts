import prisma, { FranchiseType } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/auth";

export const GET = async () => {
	try {
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
						country: true,
					},
				},
			},
		});
		if (!user || !user.franchise.country?.id) {
			return NextResponse.json(
				{ message: "country does not exist" },
				{ status: 403 }
			);
		}
		const zones = await prisma.zone.findMany({
			where: { superFranchise: null, countryId: user.franchise.country.id },
		});
		if (zones.length > 0) {
			return NextResponse.json({ message: "success", zones }, { status: 200 });
		}
		return NextResponse.json({ message: "no zones exist" }, { status: 200 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "internal server error" },
			{ status: 500 }
		);
	}
};
