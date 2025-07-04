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
		if (attempts >= 3) {
			setStatus("limit");
			return;
		}

		setLoading(true);
		const res = await fetch("/api/auth/send-phone-otp", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ phone }),
		});
		const data = await res.json();
		setLoading(false);

		if (data.message == "success") {
			setAttempts((prev) => prev + 1);
			setStatus("sent");
		} else {
			setStatus("error");
		}
	};
	const verify = async () => {
		if (attempts >= 3) {
			setStatus("limit");
			return;
		}

		setLoading(true);
		const res = await fetch("/api/auth/verify-phone-otp", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ phone, code: otp }),
		});
		const data = await res.json();
		setLoading(false);

		if (data.message == "success") {
			setAttempts((prev) => prev + 1);
			setStatus("sent");
			setStep(Steps.BUSINESS);
		} else {
			setStatus("error");
		}
	};

	return (
		<div className="bg-white text-black p-6 rounded-xl shadow-md max-w-md mx-auto text-center space-y-4">
			<h2 className="text-xl font-semibold">Verify Your Phone Number</h2>
			<p className="text-blue-600">Phone: {phone || "Not found"}</p>

			{status != "sent" ? (
				<button
					onClick={sendVerification}
					className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
					disabled={loading || attempts >= 3}>
					{loading ? "Sending..." : "Send Verification SMS"}
				</button>
			) : (
				<div>
					<div>
						<label htmlFor="otp">
							Enter OTP:{" "}
							<input
								id="otp"
								className="border border-blue-300 p-2 mb-2"
								type="text"
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
							/>
						</label>
					</div>
					<button
						onClick={verify}
						className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
						disabled={loading || attempts >= 3}>
						{loading ? "Verifying..." : "Verify OTP"}
					</button>
				</div>
			)}
			{}

			{status === "sent" && (
				<p className="text-green-600">Verification SMS sent!</p>
			)}
			{status === "error" && (
				<p className="text-red-600">Failed to send. Try again.</p>
			)}
			{status === "limit" && (
				<p className="text-red-600">You{"’"}ve reached the max attempts (3).</p>
			)}

			<button
				onClick={() => {
					setPhoneSkipped(false);
					setStep(Steps.BUSINESS);
				}}
				className="ml-4 bg-red-600 hover:bg-red-500 px-4 py-2 rounded disabled:opacity-50 text-white underline hover:text-slate-100 cursor-pointer">
				Skip
			</button>
		</div>
	);
}
