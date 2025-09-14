import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "@repo/db/client";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ clubId: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ message: "unauthorized" }, { status: 403 });
		}

		const { clubId } = await params;
		if (!clubId) {
			return NextResponse.json(
				{ message: "clubId is missing" },
				{ status: 400 }
			);
		}

		// Region gate using the FranchiseAdmin->Franchise->Region of the current user
		const fa = await prisma.franchiseAdmin.findUnique({
			where: { id: session.user.id },
			select: { franchise: { select: { region: { select: { id: true } } } } },
		});
		const regionId = fa?.franchise?.region?.id;
		if (!regionId) {
			return NextResponse.json(
				{ message: "User or region do not exist" },
				{ status: 400 }
			);
		}

		// Fetch the club only if its chapter is in the same region
		const club = await prisma.club.findFirst({
			where: {
				id: clubId,
				chapter: { regionId }, // authorization boundary
			},
			select: {
				id: true,
				name: true,
				code: true,
				description: true,
				images: true,
				chapterId: true,
				createdAt: true,
				updatedAt: true,
				chapter: { select: { id: true, name: true } },
				_count: {
					select: {
						members: true,
						homeClubMembers: true,
					},
				},
				// keep member projection minimal; add fields if your User model has them
				members: {
					select: {
						id: true,
						firstname: true, // remove if your schema doesn’t have `name`
						lastname: true,
						email: true, // remove if you don’t want to expose email here
						profileImage: true,
						homeClubId: true,
					},
					orderBy: { firstname: "asc" }, // if your User has no `name`, switch to { id: "asc" }
				},
				homeClubMembers: {
					select: {
						id: true,
						firstname: true, // remove if your schema doesn’t have `name`
						lastname: true,
						email: true,
						profileImage: true,
						homeClubId: true,
					},
					orderBy: { firstname: "asc" },
				},
			},
		});

		if (!club) {
			return NextResponse.json(
				{ message: "Club does not exist" },
				{ status: 404 }
			);
		}

		// Shape for the UI
		const data = {
			id: club.id,
			name: club.name,
			code: club.code,
			description: club.description ?? null,
			images: club.images,
			chapterId: club.chapterId,
			chapter: club.chapter, // { id, name }
			createdAt: club.createdAt,
			updatedAt: club.updatedAt,
			counts: {
				members: club._count.members,
				homeClubMembers: club._count.homeClubMembers,
			},
			members: club.members, // all users in club
			homeClubMembers: club.homeClubMembers, // subset (home club)
		};

		return NextResponse.json({ message: "success", data }, { status: 200 });
	} catch (e) {
		console.error("[GET_CLUB_BY_ID]", e);
		return NextResponse.json(
			{ message: "Internal Service Error" },
			{ status: 500 }
		);
	}
}
