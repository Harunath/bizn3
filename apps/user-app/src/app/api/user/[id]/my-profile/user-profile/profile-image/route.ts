import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";

export const POST = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const slugs = await params;
		const userId = slugs.id;
		const { imageUrl } = await req.json();
		if (!imageUrl) {
			return NextResponse.json(
				{
					message: "failed",
					errors: "Image url not found",
				},
				{ status: 400 }
			);
		}

		const user = await prisma.user.update({
			where: { id: userId },
			data: { profileImage: imageUrl },
		});
		return NextResponse.json(
			{
				message: "Profile image is updated",
				data: user.profileImage,
			},
			{ status: 201 }
		);
	} catch (e) {
		console.error("Error updating profile image:", e);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
