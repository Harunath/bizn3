import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { z } from "zod";

const gainsProfileSchema = z.object({
	goals: z.array(z.string()).optional(),
	networks: z.array(z.string()).optional(),
	accomplishments: z.array(z.string()).optional(),
	skills: z.array(z.string()).optional(),
	intrests: z.array(z.string()).optional(), // typo? "interests"?
});

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const slugs = await params;
		const id = slugs.id;
		const gainsProfile = await prisma.gainsProfile.findUnique({
			where: { userId: id },
		});

		if (!gainsProfile) {
			return NextResponse.json(
				{ message: "gainsProfile do not exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "success", data: gainsProfile },
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

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const slugs = await params;
		const userId = slugs.id;
		const body = await req.json();

		const parsed = gainsProfileSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{
					message: "Validation failed",
					errors: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const gainsProfile = await prisma.gainsProfile.create({
			data: {
				userId,
				...parsed.data,
			},
		});

		return NextResponse.json(
			{ message: "GainsProfile created", data: gainsProfile },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating GainsProfile:", error);
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

		const parsed = gainsProfileSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{
					message: "Validation failed",
					errors: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const existing = await prisma.gainsProfile.findUnique({
			where: { userId },
		});

		if (!existing) {
			return NextResponse.json(
				{ message: "GainsProfile not found" },
				{ status: 404 }
			);
		}

		const updated = await prisma.gainsProfile.update({
			where: { userId },
			data: {
				...parsed.data,
			},
		});

		return NextResponse.json(
			{ message: "GainsProfile updated successfully", data: updated },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating GainsProfile:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
