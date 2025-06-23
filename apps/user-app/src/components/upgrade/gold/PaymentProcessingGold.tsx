"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const POLLING_INTERVAL = 10000; // 10 seconds
const POLLING_TIMEOUT = 120000; // 2 minutes

const PaymentProcessingGold = () => {
	const { id } = useParams();
	const router = useRouter();

	const [status, setStatus] = useState<"PROCESSING" | "SUCCESS" | "FAILED">(
		"PROCESSING"
	);
	const [message, setMessage] = useState("Checking payment status...");
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!id) {
			toast.error("Id is missing");
			setMessage("Missing order ID");
			return;
		}
		const fetchStatus = async () => {
			try {
				const res = await fetch(`/api/payment/status/${id}`);
				const data = await res.json();
				console.log("data :", data);

				if (data.message === "success") {
					setStatus("SUCCESS");
					setMessage("Payment successful!");
					clearInterval(intervalRef.current!);
					clearTimeout(timeoutRef.current!);

					const res = await fetch("/api/free/upgrade/gold", {
						method: "POST",
						body: JSON.stringify({ paymentId: id }),
					});
					if (!res.ok) {
						toast.error("Failed to create upgrade request to gold");
					}
					const data = await res.json();
					console.log(data);
					// Optional redirect
					router.push("/free/dashboard");
				} else if (data.status === "FAILED") {
					setStatus("FAILED");
					setMessage("Payment failed. Please try again.");
					clearInterval(intervalRef.current!);
					clearTimeout(timeoutRef.current!);
					// router.push("/failure");
				} else {
					setMessage("Still processing...");
				}
			} catch (err) {
				setMessage("Error checking payment status.");
				console.error("Polling error:", err);
			}
		};

		// Initial call
		fetchStatus();

		// Start polling every 10 seconds
		intervalRef.current = setInterval(fetchStatus, POLLING_INTERVAL);

		// Timeout after 2 minutes
		timeoutRef.current = setTimeout(() => {
			clearInterval(intervalRef.current!);
			setMessage(
				"Payment is still being processed. You'll receive an update soon."
			);
		}, POLLING_TIMEOUT);

		// Cleanup on unmount
		return () => {
			clearInterval(intervalRef.current!);
			clearTimeout(timeoutRef.current!);
		};
	}, [id]);

	return (
		<div className="flex items-center justify-center h-screen flex-col">
			<h1 className="text-xl font-semibold mb-4">Payment Processing</h1>
			<p className="text-gray-700">{message}</p>

			{status === "PROCESSING" && (
				<div className="mt-6 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
			)}

			{status === "SUCCESS" && (
				<p className="text-green-600 font-medium mt-4">
					You’ll be redirected shortly.
				</p>
			)}

			{status === "FAILED" && (
				<p className="text-red-600 font-medium mt-4">
					Please try again or contact support.
				</p>
			)}
		</div>
	);
};

export default PaymentProcessingGold;
