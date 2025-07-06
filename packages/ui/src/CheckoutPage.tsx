// --- Example Usage (in a parent component within apps/admin) ---
"use client";
import { PaymentPage } from "./paymentPage"; // Adjust import path based on your Turborepo setup
import { useState, useEffect } from "react";

export function CheckoutPage({ sessionId }: { sessionId: string }) {
	console.log(
		"process.env.NEXT_PUBLIC_CASHFREE_NODE_ENV :",
		process.env.NEXT_PUBLIC_CASHFREE_NODE_ENV as string
	);
	const [error, setError] = useState<string | null>(null);

	// Trigger order creation when the component mounts or based on user action
	useEffect(() => {
		// Example: Trigger automatically - adjust based on your flow
		// createOrderAndGetSession();
	}, []);

	const handlePaymentError = (paymentError: Error) => {
		setError(`Payment setup failed: ${paymentError.message}`);
		// Maybe allow user to retry creating order?
	};

	return (
		<div>
			<h1>Checkout</h1>
			{/* Button to initiate the process */}
			{/* <button onClick={createOrderAndGetSession} disabled={loadingSession}>
        {loadingSession ? 'Processing...' : 'Proceed to Payment'}
      </button> */}

			{/* Conditionally render PaymentPage only when sessionId is available */}
			{error && <p style={{ color: "red" }}>Error: {error}</p>}

			{sessionId && !error && (
				<PaymentPage
					paymentSessionId={sessionId}
					mode={"production"}
					onError={handlePaymentError}
				/>
			)}
		</div>
	);
}
