import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import prisma from "@repo/db/client";

export const GET = async () => {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 403 });
		}
		const user = await prisma.franchiseAdmin.findUnique({
			where: {
				id: session.user.id,
			},
			select: {
				franchise: {
					select: {
						region: {
							select: {
								chapters: true,
							},
						},
					},
				},
			},
		});
		if (!user || !user.franchise.region) {
			return NextResponse.json(
				{ message: "User or region do exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "success", data: user.franchise.region.chapters },
			{ status: 200 }
		);
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "Internal Service Error" },
			{ status: 500 }
		);
	}
};

export const POST = async (req: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user || !session.user.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 403 });
		}
		const body = await req.json();
		const { name, code } = body;
		if (!name || !code) {
			return NextResponse.json(
				{ message: "name or code are missing" },
				{ status: 400 }
			);
		}
		const user = await prisma.franchiseAdmin.findUnique({
			where: {
				id: session.user.id,
			},
			select: {
				franchise: {
					select: {
						id: true,
						region: {
							select: {
								id: true,
							},
						},
					},
				},
			},
		});
		if (!user || !user.franchise.id || !user.franchise.region) {
			return NextResponse.json(
				{ message: "User or region do exist" },
				{ status: 400 }
			);
		}
		const chapter = await prisma.chapter.create({
			data: {
				name,
				code,
				parentFranchiseAdminId: session.user.id,
				regionId: user.franchise.region.id,
				regionalFranchiseId: user.franchise.id,
			},
		});
		return NextResponse.json(
			{ message: "success", data: chapter },
			{ status: 200 }
		);
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "Internal Service Error" },
			{ status: 500 }
		);
	}
};
