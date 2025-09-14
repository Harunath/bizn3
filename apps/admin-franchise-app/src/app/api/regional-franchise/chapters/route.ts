import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import prisma from "@repo/db/client";

export const GET = async () => {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 403 });
		}

		// Get the region for this Franchise Admin
		const fa = await prisma.franchiseAdmin.findUnique({
			where: { id: session.user.id },
			select: {
				franchise: {
					select: {
						region: { select: { id: true } },
					},
				},
			},
		});

		const regionId = fa?.franchise?.region?.id;
		if (!regionId) {
			return NextResponse.json(
				{ message: "User or region do not exist" },
				{ status: 400 }
			);
		}

		// Fetch chapters for the region with club counts
		const chapters = await prisma.chapter.findMany({
			where: { regionId },
			select: {
				id: true,
				name: true,
				code: true,
				regionId: true,
				description: true,
				updatedAt: true,
				_count: { select: { clubs: true } },
			},
			orderBy: { name: "asc" }, // default sort; UI can still re-sort client-side
		});

		// Flatten _count into clubCount for easier use on the client
		const data = chapters.map((c) => ({
			id: c.id,
			name: c.name,
			code: c.code,
			regionId: c.regionId,
			description: c.description,
			updatedAt: c.updatedAt,
			clubCount: c._count.clubs,
		}));

		return NextResponse.json({ message: "success", data }, { status: 200 });
	} catch (e) {
		console.error("[GET_CHAPTERS]", e);
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
