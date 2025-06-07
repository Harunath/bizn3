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
		const contactDetails = await prisma.contactDetails.findUnique({
			where: { userId: id },
		});

		if (!contactDetails) {
			return NextResponse.json(
				{ message: "contactDetails do not exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "success", data: contactDetails },
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

// Validation schema using Zod
const contactDetailsSchema = z.object({
	billingAddress: z.any().optional(),
	phone: z.string().optional(),
	mobile: z.string().optional(),
	website: z.string().url().optional(),
	links: z.array(z.string().url()).optional(),
	houseNo: z.string().optional(),
	pager: z.string().optional(),
	voiceMail: z.string().optional(),
});

export const POST = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const slugs = await params;
		const userId = slugs.id;
		const body = await req.json();

		const parsed = contactDetailsSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{
					message: "Validation failed",
					errors: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		// Check if record already exists (optional safety)
		const existing = await prisma.contactDetails.findUnique({
			where: { userId },
		});

		if (existing) {
			return NextResponse.json(
				{ message: "Contact details already exist for this user." },
				{ status: 409 }
			);
		}

		const contactDetails = await prisma.contactDetails.create({
			data: {
				...parsed.data,
				userId,
			},
		});

		return NextResponse.json(
			{ message: "Contact details created successfully", data: contactDetails },
			{ status: 201 }
		);
	} catch (e) {
		console.error("POST /contact-details error:", e);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};

// Same Zod schema used in POST, all fields optional for flexible update
const updateContactDetailsSchema = z.object({
	billingAddress: z.any().optional(),
	phone: z.string().optional(),
	mobile: z.string().optional(),
	website: z.string().url().optional(),
	links: z.array(z.string().url()).optional(),
	houseNo: z.string().optional(),
	pager: z.string().optional(),
	voiceMail: z.string().optional(),
});

export const PUT = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const slugs = await params;
		const userId = slugs.id;
		const body = await req.json();

		const parsed = updateContactDetailsSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{
					message: "Validation failed",
					errors: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		// Check if the record exists
		const existing = await prisma.contactDetails.findUnique({
			where: { userId },
		});

		if (!existing) {
			return NextResponse.json(
				{ message: "Contact details not found" },
				{ status: 404 }
			);
		}

		const updated = await prisma.contactDetails.update({
			where: { userId },
			data: {
				...parsed.data,
			},
		});

		return NextResponse.json(
			{ message: "Contact details updated successfully", data: updated },
			{ status: 200 }
		);
	} catch (e) {
		console.error("PUT /contact-details error:", e);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
