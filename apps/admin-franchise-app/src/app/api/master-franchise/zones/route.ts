import prisma, { FranchiseType } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
{
	/* 
Need to add user check
country auth check(only the master admin of that country can get the zones of that country)	
*/
}
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
			where: {
				countryId: user.franchise.country.id, // Use the retrieved countryId
			},
		});

		if (zones.length > 0) {
			return NextResponse.json({ message: "success", zones }, { status: 200 });
		}
		return NextResponse.json(
			{ message: "no zones exist for the given countryid" },
			{ status: 200 }
		);
	} catch (e) {
		console.error(e); // Use console.error for error logging
		return NextResponse.json(
			{ message: "internal server error" },
			{ status: 500 }
		);
	}
};
