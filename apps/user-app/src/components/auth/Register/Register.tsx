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
			console.log(err);
			if (err instanceof z.ZodError) {
				toast.success("Failed to send OTP to your email!");
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
				toast.success("User is register");
				router.push("/login");
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
		<div className="h-full min-w-[360px] w-[360px] lg:w-[80%] flex justify-center">
			<div className="flex-1 flex flex-col justify-center items-center rounded-lg">
				<div className="lg:w-[70%] p-4 space-y-3">
					<h2 className="text-xl font-semibold text-center text-red-600 mb-4">
						Biz network Registration{" "}
					</h2>
					<div className="flex flex-col md:flex-row gap-2 items-center">
						<label
							htmlFor="firstname"
							className="text-left md:text-right min-w-64 font-medium">
							First name
						</label>
						<CustomTextInput
							name="firstname"
							placeholder="First Name"
							autoFocus={true}
							value={formData.firstname}
							onChange={handleChange}
						/>
					</div>
					<div className="flex flex-col md:flex-row gap-2 items-center">
						<label
							htmlFor="lastname"
							className="text-left md:text-right min-w-64 font-medium">
							Last name
						</label>
						<CustomTextInput
							name="lastname"
							placeholder="Last Name"
							value={formData.lastname}
							onChange={handleChange}
						/>
					</div>
					<div className="flex flex-col md:flex-row gap-2 items-center">
						<label
							htmlFor="email"
							className="text-left md:text-right min-w-64 font-medium">
							email
						</label>
						<CustomTextInput
							name="email"
							placeholder="Mail"
							value={formData.email}
							onChange={handleChange}
						/>
					</div>
					<div className="flex flex-col md:flex-row gap-2 items-center">
						<label
							htmlFor="phone"
							className="text-left md:text-right min-w-64 font-medium">
							phone
						</label>
						<CustomTextInput
							name="phone"
							placeholder="Phone Number"
							value={formData.phone}
							onChange={handleChange}
						/>
					</div>

					<div className="flex flex-col md:flex-row gap-2 items-center">
						<label
							htmlFor="password"
							className="text-left md:text-right min-w-64 font-medium">
							password
						</label>
						<div className="space-x-2">
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								placeholder="Password"
								className="relative bg-white min-w-64 p-2 border rounded border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
								value={formData.password}
								onChange={handleChange}
							/>
							<button
								type="button"
								className="text-red-600"
								onClick={() => setShowPassword(!showPassword)}>
								{showPassword ? <FaEyeSlash /> : <FaEye />}
							</button>
						</div>
					</div>
					<div className="flex flex-col md:flex-row gap-2 items-center">
						<label
							htmlFor="confirmPassword"
							className="text-left md:text-right min-w-64 font-medium">
							Confirm Password
						</label>
						<div className="space-x-2">
							<input
								type={showConfirmPassword ? "text" : "password"}
								name="confirmPassword"
								placeholder="Confirm Password"
								className="relative bg-white min-w-64 p-2 border rounded border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
								value={formData.confirmPassword}
								onChange={handleChange}
							/>
							<button
								type="button"
								className="text-red-600"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
								{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
							</button>
						</div>
					</div>
					<div className="flex flex-col md:flex-row gap-2 items-center">
						<label
							htmlFor="otp"
							className="text-left md:text-right min-w-64 font-medium">
							Verify Mail
						</label>
						<div className="flex items-center gap-x-2">
							<input
								type="text"
								name="otp"
								placeholder="Verify Mail"
								disabled={!otpSent}
								className={`min-w-64 p-2 border rounded border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400  ${otpSent ? "bg-white" : "bg-gray-300 cursor-not-allowed"}`}
								value={formData.otp}
								onChange={handleChange}
							/>
							<button
								onClick={handleGetOtp}
								className={`min-w-32 text-red-600 text-sm border p-2 rounded ${otpSent ? "bg-gray-300 cursor-not-allowed" : "bg-white cursor-pointer"}`}
								disabled={otpSent}>
								{otpSent ? "OTP Sent" : "Get OTP"}
							</button>
						</div>
					</div>
					<div className="flex justify-center items-center">
						<button
							onClick={verifyOtp}
							className="max-w-64 w-full bg-red-600 text-white p-2 rounded mt-2"
							disabled={!otpSent}>
							Register
						</button>
					</div>

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
		</div>
	);
}

export default Register;

const CustomTextInput = ({
	name,
	placeholder,
	autoFocus,
	value,
	onChange,
}: {
	name: string;
	placeholder: string;
	autoFocus?: boolean;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	return (
		<input
			type="text"
			name={name}
			placeholder={placeholder}
			className="bg-white min-w-64 p-2 border rounded border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
			autoFocus={autoFocus ? true : false}
			value={value}
			onChange={onChange}
		/>
	);
};
