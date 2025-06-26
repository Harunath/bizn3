import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { z } from "zod";

const weeklyPresentationSchema = z.object({
	title: z.string().min(1, "Title is required"),
	descriptions: z.string().min(1, "Description is required"),
});

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const slugs = await params;
		const id = slugs.id;

		const weeklyPresentations = await prisma.weeklyPresentations.findMany({
			where: { userId: id },
			take: 10,
			orderBy: {
				createdAt: "desc",
			},
		});

		if (!weeklyPresentations || weeklyPresentations.length === 0) {
			return NextResponse.json(
				{ message: "No weeklyPresentations found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Success", data: weeklyPresentations },
			{ status: 200 }
		);
	} catch (e) {
		console.error(e);
		return NextResponse.json(
			{ message: "Internal service error" },
			{ status: 500 }
		);
	}
};

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const slugs = await params;
		const userId = slugs.id;
		const body = await req.json();

		const parsed = weeklyPresentationSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{
					message: "Validation failed",
					errors: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const weeklyPresentation = await prisma.weeklyPresentations.create({
			data: {
				userId,
				...parsed.data,
			},
		});

		return NextResponse.json(
			{ message: "weeklyPresentation created", data: weeklyPresentation },
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

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const slugs = await params;
		const userId = slugs.id;
		const body = await req.json();

		const { presentationId, ...updateFields } = body;

		if (!presentationId) {
			return NextResponse.json(
				{ message: "presentationId is required" },
				{ status: 400 }
			);
		}

		const parsed = weeklyPresentationSchema.safeParse(updateFields);

		if (!parsed.success) {
			return NextResponse.json(
				{
					message: "Validation failed",
					errors: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const existing = await prisma.weeklyPresentations.findUnique({
			where: { id: presentationId },
		});

		if (!existing || existing.userId !== userId) {
			return NextResponse.json(
				{ message: "Presentation not found or unauthorized" },
				{ status: 404 }
			);
		}

		const updated = await prisma.weeklyPresentations.update({
			where: { id: presentationId },
			data: parsed.data,
		});

		return NextResponse.json(
			{ message: "weeklyPresentation updated", data: updated },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating weeklyPresentation:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
