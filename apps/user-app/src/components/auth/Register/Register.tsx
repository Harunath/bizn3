"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";

const baseRegisterSchema = z.object({
	firstname: z.string().min(1, "First name is required"),
	lastname: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(10, "Phone number must be at least 10 digits"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(
			/(?=.*[A-Z])(?=.*[!@#$%^&*])/,
			"Password must contain an uppercase letter and a special character"
		),
	confirmPassword: z.string(),
	otp: z.string().min(1, "OTP is required"),
});

// Apply refine() separately
const registerSchema = baseRegisterSchema.refine(
	(data) => data.password === data.confirmPassword,
	{
		message: "Passwords do not match",
		path: ["confirmPassword"],
	}
);
function Register({ nextStep }: { nextStep: () => void }) {
	const [formData, setFormData] = useState({
		firstname: "",
		lastname: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
		otp: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState("");
	const [otpSent, setOtpSent] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [token, setToken] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleGetOtp = async () => {
		try {
			const emailSchema = baseRegisterSchema.pick({ email: true });
			emailSchema.parse({ email: formData.email });
			const res = await fetch("/api/auth/send-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: formData.email }),
			});
			const data = await res.json();
			if (data.success) {
				setToken(data.token);
				alert("OTP sent to your email!");
				setError("");
				setOtpSent(true);
				setSuccessMessage("OTP sent successfully. Check your email.");
			}
		} catch (err) {
			console.log(err);
			if (err instanceof z.ZodError) {
				setError(err.message);
			} else {
				setError("An unexpected error occurred.");
			}
		}
	};

	const verifyOtp = async () => {
		try {
			registerSchema.parse(formData);
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...formData, token }),
			});

			const data = await res.json();
			if (data.success) {
				alert(
					"Email verified successfully! You can now continue registration."
				);
				// Redirect or show next registration step
				nextStep();
			}
		} catch (err) {
			if (err instanceof z.ZodError) {
				console.log(err);
				setError(err.message);
			} else {
				setError("An unexpected error occurred.");
			}
		}
	};

	return (
		<div className="flex justify-center items-center">
			<div className="w-full max-w-sm p-6 bg-gray-100 rounded-lg shadow-md">
				<h2 className="text-xl font-semibold text-center text-red-600 mb-4">
					Registration{" "}
				</h2>
				<input
					type="text"
					name="firstname"
					placeholder="First Name"
					className="w-full p-2 border rounded mb-3"
					value={formData.firstname}
					onChange={handleChange}
				/>
				<input
					type="text"
					name="lastname"
					placeholder="Last Name"
					className="w-full p-2 border rounded mb-3"
					value={formData.lastname}
					onChange={handleChange}
				/>
				<input
					type="email"
					name="email"
					placeholder="Mail"
					className="w-full p-2 border rounded mb-3"
					value={formData.email}
					onChange={handleChange}
				/>
				<input
					type="text"
					name="phone"
					placeholder="Phone Number"
					className="w-full p-2 border rounded mb-3"
					value={formData.phone}
					onChange={handleChange}
				/>
				<div className="relative mb-3">
					<input
						type={showPassword ? "text" : "password"}
						name="password"
						placeholder="Password"
						className="w-full p-2 border rounded"
						value={formData.password}
						onChange={handleChange}
					/>
					<button
						type="button"
						className="absolute right-3 top-3 text-red-600"
						onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? <FaEyeSlash /> : <FaEye />}
					</button>
				</div>
				<div className="relative mb-3">
					<input
						type={showConfirmPassword ? "text" : "password"}
						name="confirmPassword"
						placeholder="Confirm Password"
						className="w-full p-2 border rounded"
						value={formData.confirmPassword}
						onChange={handleChange}
					/>
					<button
						type="button"
						className="absolute right-3 top-3 text-red-600"
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
						{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
					</button>
				</div>
				<div className="flex items-center gap-2 mb-3">
					<input
						type="text"
						name="otp"
						placeholder="Verify Mail"
						className="flex-grow p-2 border rounded"
						value={formData.otp}
						onChange={handleChange}
					/>
					<button
						onClick={handleGetOtp}
						className="text-red-600 text-sm border p-2 rounded"
						disabled={otpSent}>
						{otpSent ? "OTP Sent" : "Get OTP"}
					</button>
				</div>
				<button
					onClick={verifyOtp}
					className="w-full bg-red-600 text-white p-2 rounded mt-2"
					disabled={!otpSent}>
					Register
				</button>
				{successMessage && (
					<p className="text-green-600 text-sm mt-3 text-center">
						{successMessage}
					</p>
				)}
				{error && (
					<p className="text-red-600 text-sm mt-3 text-center">{error}</p>
				)}
			</div>
		</div>
	);
}

export default Register;
