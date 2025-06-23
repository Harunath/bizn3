// packages/ui/src/PaymentPage.tsx

import { useEffect, useState, type JSX } from "react";
// Import the load function from the Cashfree SDK
// @ts-ignore
import { load } from "@cashfreepayments/cashfree-js";

// Define props for the component
interface PaymentPageProps {
	// The payment session ID obtained from your backend (Step 1)
	paymentSessionId: string | null;
	// The mode for Cashfree SDK ('sandbox' or 'production')
	mode: "sandbox" | "production";
	// Optional: Callback for when an error occurs during setup/initiation
	onError?: (error: Error) => void;
}

export function PaymentPage({
	paymentSessionId,
	mode,
	onError,
}: PaymentPageProps): JSX.Element {
	const [isLoading, setIsLoading] = useState(true); // Start loading by default
	const [error, setError] = useState<string | null>(null);
	// Optional: Store the cashfree instance if needed later, though often not required for basic checkout
	// const [cashfreeInstance, setCashfreeInstance] = useState<any>(null);

	useEffect(() => {
		// Define an async function inside useEffect to handle SDK loading and checkout
		const initializeAndPay = async () => {
			// Ensure we have a paymentSessionId before proceeding
			if (!paymentSessionId) {
				setError("Payment session ID is missing.");
				setIsLoading(false);
				onError?.(new Error("Payment session ID is missing."));
				return;
			}

			console.log(`Initializing Cashfree SDK in ${mode} mode...`);
			setIsLoading(true);
			setError(null);

			try {
				// 1. Load the Cashfree SDK
				const cashfree = await load({ mode });

				// Check if SDK loaded successfully (load resolves to null in server environment)
				if (!cashfree) {
					console.error(
						"Cashfree SDK could not be loaded (Ensure this runs client-side)."
					);
					throw new Error("Payment SDK failed to load.");
				}
				// setCashfreeInstance(cashfree); // Optional: store the instance
				console.log("Cashfree SDK loaded successfully.");

				// 2. Initiate the Checkout process
				console.log(
					"Initiating Cashfree checkout with session ID:",
					paymentSessionId
				);
				// Use the checkout method (or other methods like paySeamless based on Cashfree docs)
				await cashfree.checkout({
					paymentSessionId: paymentSessionId,
					// Add other checkout options if needed (e.g., components to display)
					// components: ["order-details", "card", "upi"],
				});

				// Note: cashfree.checkout often handles redirection or displays a modal.
				// The promise might resolve after initiation, not necessarily after payment completion.
				// Subsequent handling relies on redirection to 'return_url' or specific SDK events if configured.
				console.log("Cashfree checkout process initiated.");
				// Loading might effectively stop here as the user interacts with Cashfree modal/redirect
			} catch (err: any) {
				console.error("Error during Cashfree SDK load or checkout:", err);
				const errorMessage =
					err.message || "An unknown error occurred during payment setup.";
				setError(errorMessage);
				onError?.(err); // Notify parent component via callback
			} finally {
				// Might set loading to false here, but redirection often happens before this point
				// Consider the user flow - if modal closes without paying, you might need specific event handling
				setIsLoading(false);
			}
		};

		// Call the async function
		initializeAndPay();

		// Cleanup function (optional, might not be strictly necessary depending on flow)
		// return () => {
		//   console.log("PaymentPage unmounting");
		// };
	}, [paymentSessionId, mode, onError]); // Rerun effect if these props change

	// --- Render UI based on state ---

	if (isLoading) {
		return <div>Loading Payment Options... Please wait.</div>;
	}

	if (error) {
		return <div style={{ color: "red" }}>Error: {error}</div>;
	}

	// If not loading and no error, Cashfree checkout should have been initiated (modal/redirect).
	// You might want a placeholder here, or this component might effectively be 'done'
	// once checkout starts, waiting for the user to be redirected away by Cashfree.
	return (
		<div>
			Redirecting to payment gateway... If you are not redirected automatically,
			please check your connection or pop-up blocker.
			{/* Or potentially render a container div if using embedded components */}
			{/* <div id="cashfree-payment-element"></div> */}
		</div>
	);
}
