import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { z } from "zod";

// const topsProfileSchema = z.object({
// 	idealReferral: z.array(z.string()).optional(),
// 	story: z.array(z.string()).optional(),
// 	topProduct: z.array(z.string()).optional(),
// 	idealReferralPartner: z.array(z.string()).optional(),
// 	topProblemSolved: z.array(z.string()).optional(),
// });

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const slugs = await params;
		const id = slugs.id;
		const weeklyPresentations = await prisma.weeklyPresentations.findMany({
			where: { userId: id },
			take: 10, // Fetches the next 10 records
			orderBy: {
				createdAt: "desc", // Optional: specify an order for consistent pagination
			},
		});

		if (!weeklyPresentations) {
			return NextResponse.json(
				{ message: "weeklyPresentations do not exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "success", data: weeklyPresentations },
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

const weeklyPresentationSchema = z.object({
	title: z.string().min(1, "Title is required"),
	descriptions: z.string().min(1, "Description is required"),
});

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const slugs = await params;
		const userId = slugs.id;

		const body = await req.json();

		// Validate with Zod
		const parsed = weeklyPresentationSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{
					message: "Validation Failed",
					errors: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const { title, descriptions } = parsed.data;

		// Create WeeklyPresentation
		const weeklyPresentation = await prisma.weeklyPresentations.create({
			data: {
				title,
				descriptions,
				userId,
			},
		});

		return NextResponse.json(
			{
				message: "weeklyPresentation created",
				data: weeklyPresentation,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating weeklyPresentation:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
