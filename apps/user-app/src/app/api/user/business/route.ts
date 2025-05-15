import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@repo/db/client";
import { authOptions } from "../../../../lib/auth";

export const GET = async () => {
	try {
		const session = await getServerSession(authOptions);
		console.log(session, " user session");
		if (!session || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				businessDetails: true,
			},
		});

		if (!user || !user.businessDetails) {
			return NextResponse.json(
				{ message: "user or business do not exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "success", data: user.businessDetails },
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

export const POST = async (req: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 401 });
		}
		const body = await req.json();
		const { name, images, category } = body;
		if (!name || !images) {
			return NextResponse.json(
				{ message: "name, images are required" },
				{ status: 400 }
			);
		}
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				businessDetails: true,
			},
		});

		if (!user) {
			return NextResponse.json(
				{ message: "user do not exist" },
				{ status: 400 }
			);
		}
		if (user.businessDetails?.id) {
			return NextResponse.json(
				{ message: "user business already exists" },
				{ status: 400 }
			);
		}

		const businessDetails = await prisma.businessDetails.create({
			data: {
				businessName: name as string,
				images: images
					? images
					: [
							"https://res.cloudinary.com/degrggosz/image/upload/v1746781128/Web__What-is-Bussines-Analytics_je92qe.webp",
						],
				category: category || "Business",
				user: {
					connect: { id: session.user.id },
				},
			},
		});
		return NextResponse.json(
			{ message: "success", data: businessDetails },
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
