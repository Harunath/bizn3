import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { z } from "zod";

// ✅ Define the schema using Zod
const addressSchema = z.object({
	addressLane1: z.string().min(1, "Address Line 1 is required"),
	addressLane2: z.string().optional(),
	city: z.string().optional(),
	state: z.string().min(1, "State is required"),
	country: z.string().min(1, "Country is required"),
	pincode: z.string().optional(),
});

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const slugs = await params;
		const id = slugs.id;
		const address = await prisma.address.findUnique({
			where: { userId: id },
		});

		if (!address) {
			return NextResponse.json(
				{ message: "address do not exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "success", data: address },
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

		// Parse body
		const body = await req.json();

		// Validate using Zod
		const validated = addressSchema.safeParse(body);
		if (!validated.success) {
			return NextResponse.json(
				{
					message: "Validation failed",
					errors: validated.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const { addressLane1, addressLane2, city, state, country, pincode } =
			validated.data;

		// Create the address in DB
		const address = await prisma.address.create({
			data: {
				addressLane1,
				addressLane2,
				city,
				state,
				country,
				pincode,
				userId,
			},
		});

		return NextResponse.json(
			{ message: "Address created", data: address },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating address:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// Partial schema for optional updates
const addressUpdateSchema = z.object({
	addressLane1: z.string().min(1).optional(),
	addressLane2: z.string().optional(),
	city: z.string().optional(),
	state: z.string().min(1).optional(),
	country: z.string().min(1).optional(),
	pincode: z.string().optional(),
});

export const PUT = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const slug = await params;
		const id = slug.id;
		const body = await req.json();

		// Validate request body
		const validated = addressUpdateSchema.safeParse(body);
		if (!validated.success) {
			return NextResponse.json(
				{
					message: "Validation failed",
					errors: validated.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const data = validated.data;

		// Check if address exists
		const existing = await prisma.address.findUnique({
			where: { userId: id },
		});

		if (!existing) {
			return NextResponse.json(
				{ message: "Address not found" },
				{ status: 404 }
			);
		}

		// Perform update with only provided fields
		const updatedAddress = await prisma.address.update({
			where: { userId: id },
			data,
		});

		return NextResponse.json(
			{ message: "Address updated successfully", data: updatedAddress },
			{ status: 200 }
		);
	} catch (e) {
		console.error("PUT /address/[id] error:", e);
		return NextResponse.json(
			{ message: "Internal service error" },
			{ status: 500 }
		);
	}
};
