import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { z } from "zod";

const bioSchema = z.object({
	yearsInBusiness: z.string(),
	yearsInCity: z.string(),
	previousJobs: z.array(z.string()),
	burningDesire: z.string(),
	hobbiesIntrests: z.array(z.string()),
	NoOneKnowsAboutMe: z.string().optional(),
	cityOfResidence: z.string().optional(),
	keyToSuccess: z.string().optional(),
});

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const { id } = await params;

		const bio = await prisma.myBio.findUnique({
			where: { userId: id },
		});

		if (!bio) {
			return NextResponse.json(
				{ message: "Bio does not exist" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Success", data: bio },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching bio:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
};

export const POST = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const { id: userId } = await params;
		const body = await req.json();

		const parsed = bioSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{
					message: "Validation error",
					errors: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const bio = await prisma.myBio.create({
			data: {
				userId,
				...parsed.data,
				yearsInBusiness: Number(parsed.data.yearsInBusiness),
				yearsInCity: Number(parsed.data.yearsInCity),
			},
		});

		return NextResponse.json(
			{ message: "Bio created", data: bio },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating bio:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
};

export const PUT = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const { id: userId } = await params;
		const body = await req.json();

		const parsed = bioSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{
					message: "Validation error",
					errors: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const existing = await prisma.myBio.findUnique({
			where: { userId },
		});

		if (!existing) {
			return NextResponse.json({ message: "Bio not found" }, { status: 404 });
		}

		const updated = await prisma.myBio.update({
			where: { userId },
			data: {
				...parsed.data,
				yearsInBusiness: Number(parsed.data.yearsInBusiness),
				yearsInCity: Number(parsed.data.yearsInCity),
			},
		});

		return NextResponse.json(
			{ message: "Bio updated successfully", data: updated },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating bio:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
