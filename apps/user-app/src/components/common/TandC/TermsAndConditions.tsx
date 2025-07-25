"use client";
// components/TandC.tsx
import React, { useState } from "react";
import TAndC from "./TandC";

const TermsAndConditions = ({
	accepted = false,
	setAccepted,
}: {
	accepted: boolean;
	setAccepted: (accepted: boolean) => void;
}) => {
	const [showTerms, setShowTerms] = useState(false);

	return (
		<div className="max-w-xl mx-auto p-4 space-y-4">
			<div className="flex items-center gap-2 mb-4">
				<input
					type="checkbox"
					id="agree"
					checked={accepted}
					onChange={(e) => setAccepted(e.target.checked)}
					className="w-4 h-4"
				/>
				<label htmlFor="agree" className="text-sm">
					I agree to the{" "}
					<button
						type="button"
						className="text-blue-600 underline"
						onClick={() => setShowTerms(true)}>
						Terms and Conditions
					</button>
				</label>
			</div>

			{showTerms && (
				<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
					<TAndC close={() => setShowTerms(false)} />
				</div>
			)}
		</div>
	);
};

export default TermsAndConditions;
