import { NextRequest, NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";
import prisma, { OrderStatus } from "@repo/db/client";

const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_BASE_URL = process.env.CASHFREE_BASE_URL!;

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: cashfreeOrderId } = await params;
		if (!cashfreeOrderId) {
			return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
		}

		// 1. Check if payment already updated
		const existingPayment = await prisma.payment.findUnique({
			where: { cashfreeOrderId },
			include: { order: true },
		});

		if (existingPayment?.status === "SUCCESS") {
			await prisma.order.update({
				where: { id: existingPayment.orderId },
				data: { status: OrderStatus.PAID },
			});

			return NextResponse.json({ message: "success" }, { status: 200 });
		} else if (existingPayment?.status === "FAILED") {
			return NextResponse.json({ message: "failed" }, { status: 400 });
		}

		// 2. Fetch from Cashfree
		const res = await fetch(`${CASHFREE_BASE_URL}/${cashfreeOrderId}`, {
			method: "GET",
			headers: {
				"x-api-version": "2022-09-01",
				"x-client-id": CASHFREE_APP_ID,
				"x-client-secret": CASHFREE_SECRET_KEY,
			},
		});

		const data = await res.json();

		if (!res.ok || data.order_status === "ACTIVE") {
			return NextResponse.json({ status: "PROCESSING" });
		}

		const {
			order_status,
			order_id,
			payment_session_id,
			order_amount,
			order_currency,
		} = data;

		let paymentStatus: "SUCCESS" | "FAILED" | "PENDING" = "PENDING";
		let orderStatus: OrderStatus = OrderStatus.PROCESSING;

		if (order_status === "PAID") {
			paymentStatus = "SUCCESS";
			orderStatus = OrderStatus.PAID;
		} else if (order_status === "EXPIRED" || order_status === "CANCELLED") {
			paymentStatus = "FAILED";
			orderStatus = OrderStatus.FAILED;
		}

		// 3. Get Order
		const order = await prisma.order.findUnique({
			where: { cashfreeOrderId: order_id },
		});

		if (!order) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		// 4. Upsert Payment
		await prisma.payment.upsert({
			where: { cashfreeOrderId: order_id },
			update: {
				status: paymentStatus,
				gatewayResponse: data,
				processedAt: new Date(),
			},
			create: {
				cashfreeOrderId: order_id,
				paymentSessionId: payment_session_id,
				orderId: order.id,
				amount: new Decimal(order_amount),
				currency: order_currency,
				gatewayResponse: data,
				status: paymentStatus,
				processedAt: new Date(),
			},
		});

		// 5. Update Order status
		await prisma.order.update({
			where: { id: order.id },
			data: {
				status: orderStatus,
				totalAmount: new Decimal(order_amount),
				updatedAt: new Date(),
			},
		});

		return NextResponse.json(
			{
				message: paymentStatus === "SUCCESS" ? "success" : "failed",
				data: paymentStatus === "SUCCESS" ? order.itemDetailsSnapshot : null,
			},
			{ status: paymentStatus === "SUCCESS" ? 200 : 400 }
		);
	} catch (err) {
		console.error("Error polling Cashfree:", err);
		return NextResponse.json({ status: "PROCESSING" }, { status: 500 });
	}
}
