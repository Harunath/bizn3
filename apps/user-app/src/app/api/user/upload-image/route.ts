import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function POST() {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}

		const timestamp = Math.round(new Date().getTime() / 1000);
		const folder = `users/${session.user.id}`;

		const signature = cloudinary.utils.api_sign_request(
			{
				timestamp,
				folder,
			},
			process.env.CLOUDINARY_API_SECRET!
		);

		return NextResponse.json(
			{
				signature,
				timestamp,
				folder,
				apiKey: process.env.CLOUDINARY_API_KEY,
				cloudName: process.env.CLOUDINARY_CLOUD_NAME,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Cloudinary Signature Error:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
