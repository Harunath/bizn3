import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/auth";
import prisma, { UserMembershipType } from "@repo/db/client";
import { z } from "zod";

const vipUpgradeSchema = z.object({
	paymentId: z.string().min(1),
	categoryId: z.string().cuid(),
});

export const POST = async (req: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const parsed = vipUpgradeSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ message: "Invalid input", errors: parsed.error.errors },
				{ status: 400 }
			);
		}

		const { paymentId, categoryId } = parsed.data;

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				membershipType: true,
				homeClub: {
					select: {
						id: true,
						chapter: {
							select: {
								id: true,
								regionalFranchise: true,
							},
						},
					},
				},
			},
		});

		const chapter = user?.homeClub?.chapter;
		const franchise = chapter?.regionalFranchise;

		if (!user || !user.homeClub || !chapter || !franchise) {
			return NextResponse.json(
				{ message: "User profile incomplete" },
				{ status: 400 }
			);
		}

		if (user.membershipType !== UserMembershipType.GOLD) {
			return NextResponse.json(
				{ message: "Only free users can upgrade" },
				{ status: 400 }
			);
		}

		// 🔍 Check payment is valid and completed
		const payment = await prisma.payment.findUnique({
			where: { id: paymentId },
		});

		if (
			!payment ||
			payment.status !== "SUCCESS" ||
			Number(payment.amount) == 12000
		) {
			return NextResponse.json(
				{ message: "Invalid or incomplete payment" },
				{ status: 400 }
			);
		}

		// 🔍 Check if category exists
		const categoryExists = await prisma.businessCategory.findUnique({
			where: { id: categoryId },
		});

		if (!categoryExists) {
			return NextResponse.json(
				{ message: "Invalid business category" },
				{ status: 400 }
			);
		}

		// 🛑 Check if category is already taken in chapter
		const taken = await prisma.chapterCategoryAssignment.findUnique({
			where: {
				chapterId_categoryId: {
					chapterId: chapter.id,
					categoryId: categoryId,
				},
			},
		});

		if (taken) {
			return NextResponse.json(
				{ message: "Category already assigned in chapter" },
				{ status: 409 }
			);
		}

		// ✅ Create upgrade request
		const upgrade = await prisma.upgradeRequest.create({
			data: {
				paymentId,
				requestedTier: UserMembershipType.VIP,
				franchiseId: franchise.id,
				userId: session.user.id,
				categoryId,
			},
		});

		return NextResponse.json(
			{ message: "success", data: upgrade },
			{ status: 200 }
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json({ message: "Internal error" }, { status: 500 });
	}
};
