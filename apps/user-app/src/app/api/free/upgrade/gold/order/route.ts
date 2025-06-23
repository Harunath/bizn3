import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
import { createCashfreeOrder } from "@repo/payments/order";
import { authOptions } from "../../../../../../lib/auth";

interface CustomerDetails {
	customer_id: string;
	customer_email: string;
	customer_phone: string;
	customer_name?: string;
}

interface CreateOrderInput {
	order_amount: number;
	order_currency: string;
	customer_details: CustomerDetails;
	return_url: string;
	order_note?: string;
}

export const POST = async (req: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user?.id) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const userDetails = await prisma.user.findUnique({
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
								regionalFranchiseId: true,
							},
						},
					},
				},
			},
		});

		const chapter = userDetails?.homeClub?.chapter;
		const franchiseId = chapter?.regionalFranchise.id;
		const body = await req.json();
		const { clubs } = body;
		const amount = 5000;

		if (!clubs || !franchiseId) {
			return NextResponse.json(
				{ message: "Missing required fields" },
				{ status: 400 }
			);
		}
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				email: true,
				phone: true,
				firstname: true,
				lastname: true,
			},
		});

		if (!user) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		const input: CreateOrderInput = {
			order_amount: amount,
			order_currency: "INR",
			return_url:
				process.env.NODE_ENV == "production"
					? `${process.env.NEXTAUTH_URL}/free/upgrade/gold/callback`
					: "http://localhost:3000/free/upgrade/gold/callback", // Set in .env
			order_note: "Upgrade membership",
			customer_details: {
				customer_id: user.id,
				customer_email: user.email ?? "",
				customer_phone: user.phone ?? "",
				customer_name: user.firstname ?? "" + user.lastname ?? "",
			},
		};

		const res = await createCashfreeOrder(input);
		if (!res.success) {
			return NextResponse.json(
				{ message: "Failed to create payment order" },
				{ status: 400 }
			);
		}

		const order = await prisma.order.create({
			data: {
				userId: user.id,
				cashfreeOrderId: res.order_id,
				paymentSessionId: res.payment_session_id,
				totalAmount: amount,
				currency: "INR",
				notes: "Upgrade to premium membership",
				itemDetailsSnapshot: {
					userId: user.id,
					franchiseId,
					clubs,
				},
			},
		});

		return NextResponse.json(
			{
				message: "Order created",
				payment_session_id: res.payment_session_id,
				order_id: order.id,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Payment init error:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
