import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { z } from "zod";

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const slugs = await params;
		const id = slugs.id;
		const personalDetails = await prisma.personalDetails.findUnique({
			where: { userId: id },
		});

		if (!personalDetails) {
			return NextResponse.json(
				{ message: "personalDetails do not exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "success", data: personalDetails },
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

// // Enum options should match your actual DB enums
const TitleTypes = ["None", "Mr", "Mrs", "Miss", "Dr"] as const;
const GenderTypes = ["None", "Male", "Female", "Others"] as const;

// Zod schema for validation
const personalDetailsSchema = z.object({
	title: z.enum(TitleTypes).optional(), // Default handled by Prisma
	firstname: z.string().min(1),
	lastname: z.string().min(1),
	suffix: z.string().optional(),
	displayname: z.string().min(1),
	gender: z.enum(GenderTypes).optional(), // Default handled by Prisma
});

export const POST = async (
	req: NextRequest,
	{ params }: { params: { id: string } }
) => {
	try {
		const userId = params.id;
		const body = await req.json();

		const parsed = personalDetailsSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{
					message: "Validation failed",
					errors: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		// Check if already exists
		const existing = await prisma.personalDetails.findUnique({
			where: { userId },
		});

		if (existing) {
			return NextResponse.json(
				{ message: "Personal details already exist for this user" },
				{ status: 409 }
			);
		}

		const created = await prisma.personalDetails.create({
			data: {
				...parsed.data,
				userId,
			},
		});

		return NextResponse.json(
			{ message: "Personal details created successfully", data: created },
			{ status: 201 }
		);
	} catch (e) {
		console.error("Error creating personal details:", e);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};

const updatePersonalDetailsSchema = z.object({
	title: z.enum(TitleTypes).optional(),
	firstname: z.string().min(1).optional(),
	lastname: z.string().min(1).optional(),
	suffix: z.string().optional(),
	displayname: z.string().min(1).optional(),
	gender: z.enum(GenderTypes).optional(),
});

export const PUT = async (
	req: NextRequest,
	{ params }: { params: { id: string } }
) => {
	try {
		const userId = params.id;
		const body = await req.json();

		const parsed = updatePersonalDetailsSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{
					message: "Validation failed",
					errors: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const existing = await prisma.personalDetails.findUnique({
			where: { userId },
		});

		if (!existing) {
			return NextResponse.json(
				{ message: "Personal details not found for this user" },
				{ status: 404 }
			);
		}

		const updated = await prisma.personalDetails.update({
			where: { userId },
			data: {
				...parsed.data,
			},
		});

		return NextResponse.json(
			{ message: "Personal details updated successfully", data: updated },
			{ status: 200 }
		);
	} catch (e) {
		console.error("Error updating personal details:", e);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
