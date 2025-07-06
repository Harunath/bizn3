import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../../../lib/auth";
import prisma from "@repo/db/client";

export const GET = async () => {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Get chapterId of the user
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				homeClub: {
					select: {
						chapterId: true,
					},
				},
			},
		});

		const chapterId = user?.homeClub?.chapterId;

		if (!chapterId) {
			return NextResponse.json(
				{ message: "No chapter found for user" },
				{ status: 400 }
			);
		}

		// Get categoryIds already assigned to the chapter
		const assignedCategories = await prisma.chapterCategoryAssignment.findMany({
			where: { chapterId },
			select: { categoryId: true },
		});

		const assignedCategoryIds = assignedCategories.map((c) => c.categoryId);

		// Get categories that are NOT assigned
		const availableCategories = await prisma.businessCategory.findMany({
			where: {
				id: {
					notIn: assignedCategoryIds,
				},
			},
		});

		return NextResponse.json(
			{ message: "success", data: { availableCategories } },
			{ status: 200 }
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
