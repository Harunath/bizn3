"use client";

import { useState } from "react";
import { Steps, useUser } from "../../../lib/store/user";

export default function PhoneVerification({ phone }: { phone: string }) {
	const [status, setStatus] = useState<"idle" | "sent" | "error" | "limit">(
		"idle"
	);
	const [attempts, setAttempts] = useState(0);
	const [loading, setLoading] = useState(false);
	const [otp, setOtp] = useState("");
	const { setStep, setPhoneSkipped } = useUser();

	const sendVerification = async () => {
		if (attempts >= 3) return setStatus("limit");

		setLoading(true);
		const res = await fetch("/api/auth/send-phone-otp", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ phone }),
		});
		const data = await res.json();
		setLoading(false);

		if (data.message === "success") {
			setAttempts((prev) => prev + 1);
			setStatus("sent");
		} else {
			setStatus("error");
		}
	};

	const verify = async () => {
		if (attempts >= 3) return setStatus("limit");

		setLoading(true);
		const res = await fetch("/api/auth/verify-phone-otp", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ phone, code: otp }),
		});
		const data = await res.json();
		setLoading(false);

		if (data.message === "success") {
			setAttempts((prev) => prev + 1);
			setStatus("sent");
			setStep(Steps.BUSINESS);
		} else {
			setStatus("error");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
			<div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 text-center space-y-6">
				<h2 className="text-2xl font-bold text-gray-800">
					Verify Your Phone Number
				</h2>
				<p className="text-blue-600 text-sm">
					Phone: <span className="font-medium">{phone || "Not found"}</span>
				</p>

				{status !== "sent" ? (
					<button
						onClick={sendVerification}
						disabled={loading || attempts >= 3}
						className={`w-full py-2 px-4 text-white font-medium rounded-md transition ${
							loading || attempts >= 3
								? "bg-gray-400 cursor-not-allowed"
								: "bg-green-600 hover:bg-green-700"
						}`}>
						{loading ? "Sending..." : "Send Verification SMS"}
					</button>
				) : (
					<div className="space-y-4">
						<div className="text-left">
							<label
								htmlFor="otp"
								className="block text-sm font-medium text-gray-700 mb-1">
								Enter OTP
							</label>
							<input
								id="otp"
								type="text"
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
								className="w-full px-3 py-2 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter the code you received"
							/>
						</div>

						<button
							onClick={verify}
							disabled={loading || attempts >= 3}
							className={`w-full py-2 px-4 text-white font-medium rounded-md transition ${
								loading || attempts >= 3
									? "bg-gray-400 cursor-not-allowed"
									: "bg-green-600 hover:bg-green-700"
							}`}>
							{loading ? "Verifying..." : "Verify OTP"}
						</button>
					</div>
				)}

				{/* Feedback messages */}
				{status === "sent" && (
					<p className="text-green-600 text-sm">Verification SMS sent!</p>
				)}
				{status === "error" && (
					<p className="text-red-600 text-sm">
						Failed to send or verify. Try again.
					</p>
				)}
				{status === "limit" && (
					<p className="text-red-600 text-sm">
						You’ve reached the maximum attempts (3).
					</p>
				)}

				<button
					onClick={() => {
						setPhoneSkipped(false);
						setStep(Steps.BUSINESS);
					}}
					className="text-sm text-red-600 underline hover:text-red-500">
					Skip phone verification
				</button>
			</div>
		</div>
	);
}
