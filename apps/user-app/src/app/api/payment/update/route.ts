import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma, { OrderStatus } from "@repo/db/client";
import { Decimal } from "@prisma/client/runtime/library";

// Replace with your actual secret
const CASHFREE_WEBHOOK_SECRET = process.env.CASHFREE_WEBHOOK_SECRET!;

// Signature Verification Utility
function verifyCashfreeSignature(
	payload: string,
	signature: string,
	secret: string
) {
	const hmac = crypto
		.createHmac("sha256", secret)
		.update(payload)
		.digest("base64");
	return hmac === signature;
}

export const POST = async (req: NextRequest) => {
	try {
		const rawBody = await req.text();
		const signature = req.headers.get("x-webhook-signature");

		if (
			!signature ||
			!verifyCashfreeSignature(rawBody, signature, CASHFREE_WEBHOOK_SECRET)
		) {
			console.warn("❌ Invalid webhook signature");
			return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
		}

		const body = JSON.parse(rawBody);
		console.log("✅ Verified webhook body:", body);

		if (body.type !== "PAYMENT_SUCCESS_WEBHOOK") {
			console.warn("⚠️ Unhandled webhook type:", body.type);
			return NextResponse.json(
				{ error: "Unhandled event type" },
				{ status: 400 }
			);
		}

		const paymentData = body.data?.payment;
		const orderData = body.data?.order;

		if (!paymentData || !orderData) {
			console.warn("❌ Missing payment or order data");
			return NextResponse.json(
				{ error: "Missing required data" },
				{ status: 400 }
			);
		}

		// Check if payment is already processed
		const existingPayment = await prisma.payment.findUnique({
			where: { cashfreeOrderId: orderData.order_id },
		});

		if (existingPayment?.status === "SUCCESS") {
			console.log("✅ Payment already processed");
			return NextResponse.json({ received: true }, { status: 200 });
		}

		// Update or insert payment record
		await prisma.payment.upsert({
			where: { cashfreeOrderId: orderData.order_id },
			update: {
				status: "SUCCESS",
				amount: new Decimal(paymentData.payment_amount),
				currency: paymentData.payment_currency,
				paymentMethod: paymentData.payment_method,
				gatewayResponse: paymentData.payment_message,
				processedAt: new Date(),
			},
			create: {
				cashfreeOrderId: orderData.order_id,
				paymentSessionId: orderData.payment_session_id,
				orderId: existingPayment?.orderId ?? "", // fallback if needed
				amount: new Decimal(paymentData.payment_amount),
				currency: paymentData.payment_currency,
				gatewayResponse: paymentData.payment_message,
				status: "SUCCESS",
				paymentMethod: paymentData.payment_method,
				processedAt: new Date(),
			},
		});

		// Update order status
		await prisma.order.update({
			where: { cashfreeOrderId: orderData.order_id },
			data: {
				totalAmount: new Decimal(orderData.order_amount),
				status: OrderStatus.PAID,
			},
		});

		console.log("✅ Payment and order updated successfully");

		return NextResponse.json({ received: true }, { status: 200 });
	} catch (error) {
		console.error("❌ Webhook error:", error);
		return NextResponse.json(
			{ error: "Failed to process webhook" },
			{ status: 500 }
		);
	}
};
