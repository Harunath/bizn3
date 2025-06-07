import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { z } from "zod";

const topsProfileSchema = z.object({
	idealReferral: z.array(z.string()).optional(),
	story: z.array(z.string()).optional(),
	topProduct: z.array(z.string()).optional(),
	idealReferralPartner: z.array(z.string()).optional(),
	topProblemSolved: z.array(z.string()).optional(),
});

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const slugs = await params;
		const id = slugs.id;
		const topsProfile = await prisma.topsProfile.findUnique({
			where: { userId: id },
		});

		if (!topsProfile) {
			return NextResponse.json(
				{ message: "topsProfile do not exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "success", data: topsProfile },
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

		const parsed = topsProfileSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{
					message: "Validation error",
					errors: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const topsProfile = await prisma.topsProfile.create({
			data: {
				userId,
				...parsed.data,
			},
		});

		return NextResponse.json(
			{ message: "topsProfile created", data: topsProfile },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating topsProfile:", error);
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

		const parsed = topsProfileSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{
					message: "Validation error",
					errors: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const existing = await prisma.topsProfile.findUnique({ where: { userId } });
		if (!existing) {
			return NextResponse.json(
				{ message: "TopsProfile not found" },
				{ status: 404 }
			);
		}

		const updated = await prisma.topsProfile.update({
			where: { userId },
			data: parsed.data,
		});

		return NextResponse.json(
			{ message: "topsProfile updated", data: updated },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating topsProfile:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
