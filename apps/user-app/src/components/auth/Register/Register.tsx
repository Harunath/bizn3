"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { z } from "zod";
import { useRouter } from "next/navigation";

const baseRegisterSchema = z.object({
	firstname: z.string().min(1, "First name is required"),
	lastname: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().length(10, "Phone number must be 10 digits"),
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

// ...zod schema and refine (same as yours)

function Register() {
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

	const router = useRouter();

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
				toast.success("OTP sent to your email!");
				setError("");
				setOtpSent(true);
				setSuccessMessage("OTP sent successfully. Check your email.");
			}
		} catch (err) {
			if (err instanceof z.ZodError) {
				toast.error("Invalid email format.");
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
				body: JSON.stringify({
					...formData,
					phone: `+91${formData.phone}`,
					token,
				}),
			});
			const data = await res.json();
			if (data.success) {
				toast.success("Registered successfully!");
				router.push("/login");
			}
		} catch (err) {
			if (err instanceof z.ZodError) {
				setError(err.message);
			} else {
				setError("An unexpected error occurred.");
			}
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
			<div className="w-full max-w-3xl p-6 bg-white shadow-xl rounded-lg">
				<h2 className="text-2xl font-bold text-center text-red-600 mb-6">
					User Registration
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<CustomTextInput
						label="First Name"
						name="firstname"
						value={formData.firstname}
						onChange={handleChange}
					/>
					<CustomTextInput
						label="Last Name"
						name="lastname"
						value={formData.lastname}
						onChange={handleChange}
					/>
					<CustomTextInput
						label="Email"
						name="email"
						value={formData.email}
						onChange={handleChange}
					/>
					<div className="w-full">
						<label
							htmlFor="phone"
							className="block text-sm font-medium text-gray-700 mb-1">
							Phone
						</label>
						<div className="flex">
							<span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-blue-400 bg-gray-100 text-gray-700 text-sm">
								+91
							</span>
							<input
								type="text"
								name="phone"
								id="phone"
								maxLength={10}
								value={formData.phone}
								onChange={handleChange}
								className="w-full p-2 border border-blue-400 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter 10-digit number"
							/>
						</div>
					</div>

					<div className="col-span-1 relative">
						<CustomTextInput
							label="Password"
							name="password"
							type={showPassword ? "text" : "password"}
							value={formData.password}
							onChange={handleChange}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute top-9 right-3 text-gray-500">
							{showPassword ? <FaEyeSlash /> : <FaEye />}
						</button>
					</div>

					<div className="col-span-1 relative">
						<CustomTextInput
							label="Confirm Password"
							name="confirmPassword"
							type={showConfirmPassword ? "text" : "password"}
							value={formData.confirmPassword}
							onChange={handleChange}
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="absolute top-9 right-3 text-gray-500">
							{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
						</button>
					</div>

					<div className="col-span-1 md:col-span-2 flex items-end gap-3">
						<div className="w-full">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								OTP
							</label>
							<input
								type="text"
								name="otp"
								placeholder="Enter OTP"
								disabled={!otpSent}
								className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
									otpSent
										? "border-blue-400 focus:ring-blue-500 bg-white"
										: "bg-gray-100 cursor-not-allowed"
								}`}
								value={formData.otp}
								onChange={handleChange}
							/>
						</div>
						<button
							onClick={handleGetOtp}
							disabled={otpSent}
							className={`min-w-fit h-10 px-4 py-2 text-sm font-medium rounded-md transition ${
								otpSent
									? "bg-gray-300 text-gray-600 cursor-not-allowed"
									: "bg-blue-600 text-white hover:bg-blue-700"
							}`}>
							{otpSent ? "OTP Sent" : "Get OTP"}
						</button>
					</div>
				</div>

				{error && (
					<p className="text-sm text-red-600 text-center mt-4">{error}</p>
				)}
				{successMessage && (
					<p className="text-sm text-green-600 text-center mt-4">
						{successMessage}
					</p>
				)}

				<button
					onClick={verifyOtp}
					disabled={!otpSent}
					className={`w-full mt-6 py-2 rounded-md font-semibold transition ${
						otpSent
							? "bg-red-600 text-white hover:bg-red-700"
							: "bg-gray-300 text-gray-500 cursor-not-allowed"
					}`}>
					Register
				</button>
			</div>
		</div>
	);
}

export default Register;

const CustomTextInput = ({
	name,
	label,
	type = "text",
	value,
	onChange,
}: {
	name: string;
	label: string;
	type?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	return (
		<div className="w-full">
			<label
				htmlFor={name}
				className="block text-sm font-medium text-gray-700 mb-1">
				{label}
			</label>
			<input
				type={type}
				name={name}
				id={name}
				value={value}
				onChange={onChange}
				className="w-full p-2 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
	);
};
