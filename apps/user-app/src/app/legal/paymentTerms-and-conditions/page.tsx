import React from "react";

const PaymentTermsAndConditions = () => {
	return (
		<div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
			<h1 className="text-3xl font-bold mb-6">Payment Terms and Conditions</h1>

			<p className="text-sm text-gray-500 mb-4">Last updated on 04-03-2025</p>

			<p className="mb-4">
				By proceeding with a payment on our website, you acknowledge that you
				have read, understood, and agree to these Payment Terms and Conditions,
				along with our
				<a
					href="/legal/terms-and-conditions"
					className="text-blue-600 underline">
					{" "}
					Terms & Conditions
				</a>
				,
				<a href="/legal/refund-policy" className="text-blue-600 underline">
					{" "}
					Cancellation & Refund Policy
				</a>
				, and
				<a href="/legal/privacy-policy" className="text-blue-600 underline">
					{" "}
					Privacy Policy
				</a>
				.
			</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				1. Payment Authorization
			</h2>
			<p className="mb-4">
				By initiating a payment, you authorize BIZ LINK NETWORK PRIVATE LIMITED
				to charge the full amount to your selected payment method. You confirm
				that the payment details provided are accurate, complete, and that you
				are authorized to use the payment method.
			</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				2. Charges and Billing
			</h2>
			<p className="mb-4">
				All applicable charges must be paid in Indian Rupees (INR) unless
				otherwise stated. Prices are subject to change without notice but
				confirmed orders will not be affected.
			</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				3. Payment Confirmation
			</h2>
			<p className="mb-4">
				Once your payment is successfully processed, you will receive a
				confirmation via email or an on-screen notification. Please retain this
				confirmation for your records.
			</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				4. Refunds and Cancellations
			</h2>
			<p className="mb-4">
				Refund and cancellation policies are governed by our
				<a href="/legal/refund-policy" className="text-blue-600 underline">
					{" "}
					Cancellation & Refund Policy
				</a>
				. Refunds will be processed within 6-8 business days upon approval.
			</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">
				5. Failed or Reversed Payments
			</h2>
			<p className="mb-4">
				No service or product will be deemed confirmed in the event of a failed
				or reversed payment. Please contact support to resolve the issue or
				retry the transaction.
			</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">6. Security</h2>
			<p className="mb-4">
				We use secure payment gateways to protect your data. However, no method
				of transmission over the internet is 100% secure, and we disclaim
				liability for any breaches beyond our control.
			</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">7. Dispute Resolution</h2>
			<p className="mb-4">
				All payment-related disputes must be reported within 48 hours to
				<a
					href="mailto:infojaaaga@gmail.com"
					className="text-blue-600 underline">
					{" "}
					infojaaaga@gmail.com
				</a>
				. All disputes are subject to the exclusive jurisdiction of the courts
				in Ameerpet, Telangana, India.
			</p>

			<h2 className="text-xl font-semibold mt-6 mb-2">8. Contact Us</h2>
			<p className="mb-1">BIZ LINK NETWORK PRIVATE LIMITED</p>
			<p className="mb-1">
				Flat No.203, RR Heights, 7-1-414/6, Srinivasanagar,
			</p>
			<p className="mb-1">
				Sanjeev Reddy Nagar S.O, Ameerpet, Telangana, India - 500038
			</p>
			<p className="mb-1">📞 +91 8096053819</p>
			<p>
				✉{" "}
				<a
					href="mailto:infojaaaga@gmail.com"
					className="text-blue-600 underline">
					infojaaaga@gmail.com
				</a>
			</p>
		</div>
	);
};

export default PaymentTermsAndConditions;
