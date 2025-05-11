import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	try {
		console.log("hitting api/user/clubs");
		console.log(authOptions);
		const session = await getServerSession(authOptions);
		if (!session || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}
		const body = await req.json();
		console.log(body);
		// const {countryId,zoneId,regionId} = body
		return NextResponse.json(
			{ message: "success", data: body },
			{ status: 200 }
		);
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "Internal service error" },
			{ status: 500 }
		);
	}
};
