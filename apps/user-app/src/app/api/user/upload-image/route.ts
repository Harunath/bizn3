import { NextRequest, NextResponse } from "next/server";
import { upload } from "@repo/common/upload";

export async function POST(req: NextRequest) {
	try {
		const { images, userId } = await req.json(); // Fetch the image and public_id from the request
		const uploadImages = [];
		if ((!images && images.length == 0) || !userId) {
			return NextResponse.json({ message: "no images" }, { status: 400 });
		}
		for (const image in images) {
			const uploadResult = await upload({ image, public_id: userId });
			uploadImages.push(uploadResult);
		}
		console.log(uploadImages);
		return NextResponse.json(
			{ message: "success", data: uploadImages },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Upload Error: ", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
