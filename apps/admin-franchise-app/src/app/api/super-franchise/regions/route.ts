import prisma, { FranchiseType } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";

export const GET = async () => {
	try {
		const session = await getServerSession(authOptions);
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
						zone: {
							select: {
								regions: true,
							},
						},
					},
				},
			},
		});
		if (!user || !user.franchise.zone || !user.franchise.zone?.regions) {
			return NextResponse.json(
				{ message: "regions does not exist" },
				{ status: 403 }
			);
		}
		const regions = user.franchise.zone.regions;
		if (regions.length > 0) {
			return NextResponse.json(
				{ message: "success", regions },
				{ status: 200 }
			);
		}
		return NextResponse.json({ message: "no regions exist" }, { status: 200 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "internal server error" },
			{ status: 500 }
		);
	}
};
