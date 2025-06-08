"use client";

import { useState } from "react";
import { FiTrash } from "react-icons/fi";
import Image from "next/image";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { upload } from "@repo/common/upload";
import { z } from "zod";

const passwordSchema = z.object({
	oldPassword: z.string().min(1, "Old password is required"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(
			/(?=.*[A-Z])(?=.*[!@#$%^&*])/,
			"Password must contain an uppercase letter and a special character"
		),
});

export default function UserProfile({
	userId,
	profileImageUrl,
}: {
	userId: string;
	profileImageUrl: string;
}) {
	const [profileImage, setProfileImage] = useState<string | null>(
		profileImageUrl
	);
	const [password, setPassword] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [open, setOpen] = useState(false);
	const [language, setLanguage] = useState("English (IN)");
	const [timezone, setTimezone] = useState("Asia/Kolkata");

	// For feedback messages
	const [statusMessage, setStatusMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setProfileImage(reader.result as string);
			reader.readAsDataURL(file);
		}
		const files = e.target.files;
		if (!files) return;
		const res = await fetch("/api/user/upload-image", {
			method: "POST",
		});
		const result = await res.json();
		const { signature, timestamp, folder, apiKey, cloudName } = result;
		const filesArray = Array.from(files);
		const urls = await upload({
			signature,
			files: filesArray,
			timestamp,
			folder,
			apiKey,
			cloudName,
		});
		setProfileImage(urls[0] ?? null);
	};

	const handleDeleteImage = () => {
		setProfileImage(null);
		setStatusMessage("Profile image deleted.");
	};

	// Your updatePassword function
	const updatePassword = async () => {
		setStatusMessage(null);
		setErrorMessage(null);

		// Validate using schema
		const result = passwordSchema.safeParse({ oldPassword, password });

		if (!result.success) {
			const firstError = result.error.errors[0]?.message || "Invalid input.";
			setErrorMessage(firstError);
			toast.error(firstError);
			return;
		}

		try {
			const res = await fetch(
				`/api/user/${userId}/my-profile/user-profile/update-password`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						oldPassword,
						newPassword: password, // Adjust based on what your API expects
					}),
				}
			);

			if (!res.ok) throw new Error(`Error: ${res.statusText}`);

			const response = await res.json();
			setStatusMessage("Password updated successfully.");
			toast.success(response.data);
			setPassword("");
			setOldPassword("");
			setOpen(false);
		} catch (e) {
			if (e instanceof Error) {
				setErrorMessage(e.message);
			} else {
				setErrorMessage("An unknown error occurred.");
			}
			toast.error("Failed to change password");
		}
	};

	const updateProfileImage = async (imageUrl: string) => {
		setStatusMessage(null);
		setErrorMessage(null);
		if (!imageUrl) {
			setErrorMessage("No profile image to update.");
			return;
		}
		try {
			const res = await fetch(
				`/api/user/${userId}/my-profile/user-profile/profile-image`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ imageUrl: imageUrl }),
				}
			);
			if (!res.ok) throw new Error(`Error: ${res.statusText}`);
			const response = await res.json();
			setStatusMessage("profileImage updated successfully.");
			toast.success(response.data);
		} catch (e) {
			if (e instanceof Error) {
				setErrorMessage(e.message);
			} else {
				setErrorMessage("An unknown error occurred.");
			}
			toast.error("Failed to change profileImage");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
			<form
				className="w-full max-w-6xl bg-white p-8 rounded-lg shadow"
				onSubmit={(e) => e.preventDefault()}>
				<div className="grid grid-cols-2 gap-6 items-start">
					<div className="space-y-6">
						<div>
							<label className="block text-gray-700 font-semibold mb-1">
								Username
							</label>
							<div className="flex items-center gap-4">{/* User name */}</div>
						</div>

						<div>
							<label className="block text-gray-700 font-semibold mb-1">
								Password
							</label>
							<div className="flex items-center gap-4 relative">
								<input
									type="password"
									value="password"
									placeholder="Enter new password"
									className="bg-gray-200 rounded px-4 py-2 flex-1 focus:outline-none"
									disabled
								/>
								<motion.button
									transition={{ duration: 0.1 }}
									layoutId="updatePassword"
									type="button"
									onClick={() => setOpen(true)}
									className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer">
									Change Password
								</motion.button>
							</div>
						</div>
						{open && (
							<motion.div
								className=" fixed z-50 inset-0 backdrop-blur-md flex items-center justify-center"
								layoutId="updatePassword"
								transition={{ duration: 0.1 }}>
								<div className="flex flex-col gap-y-4 bg-gray-100 p-8 rounded-2xl relative">
									<button
										type="button"
										onClick={() => setOpen(false)}
										className=" absolute -right-8 -top-8 text-gray-400  p-2 rounded hover:text-black">
										X
									</button>
									<input
										type="password"
										value={oldPassword}
										onChange={(e) => setOldPassword(e.target.value)}
										placeholder="Enter old password"
										className="bg-gray-200 rounded px-4 py-2 flex-1 focus:outline-none"
									/>
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Enter new password"
										className="bg-gray-200 rounded px-4 py-2 flex-1 focus:outline-none"
									/>
									<button
										type="button"
										onClick={updatePassword}
										className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ${password != oldPassword ? "cursor-pointer" : "cursor-not-allowed"}`}
										disabled={!password || !oldPassword}>
										Update password
									</button>
								</div>
							</motion.div>
						)}

						<div>
							<label className="block text-gray-700 font-semibold mb-1">
								Profile Image
							</label>
							<div className="flex items-start gap-4">
								<div className="w-32 h-40 overflow-hidden rounded bg-gray-200">
									{profileImage ? (
										<Image
											src={profileImage}
											alt="Profile"
											width={128}
											height={160}
											className="object-cover w-full h-full"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											No Image
										</div>
									)}
								</div>
								<div className="space-y-2">
									<label className="inline-block bg-red-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-700">
										Change Profile Picture
										<input
											type="file"
											onChange={handleImageChange}
											className="hidden"
										/>
									</label>
									<button
										type="button"
										onClick={handleDeleteImage}
										className="text-red-600 border border-red-600 px-3 py-2 rounded hover:bg-red-100 flex items-center gap-1"
										title="Delete Image">
										<FiTrash />
									</button>
									<button
										type="button"
										onClick={() =>
											profileImage && updateProfileImage(profileImage)
										}
										disabled={!profileImage}
										className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-2 ${
											!profileImage ? "opacity-50 cursor-not-allowed" : ""
										}`}>
										Save Profile Image
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-6 pt-1">
						<div>
							<label className="block text-gray-700 font-semibold mb-1">
								Language
							</label>
							<div className="flex items-center gap-4">
								<input
									type="text"
									value={language}
									onChange={(e) => setLanguage(e.target.value)}
									className="bg-white border border-gray-300 rounded px-4 py-2 flex-1 focus:outline-none"
									disabled
								/>
							</div>
						</div>

						<div>
							<label className="block text-gray-700 font-semibold mb-1">
								Timezone
							</label>
							<div className="flex items-center gap-4">
								<input
									type="text"
									value={timezone}
									onChange={(e) => setTimezone(e.target.value)}
									className="bg-white border border-gray-300 rounded px-4 py-2 flex-1 focus:outline-none"
									disabled
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Status messages */}
				<div className="mt-6">
					{statusMessage && <p className="text-green-600">{statusMessage}</p>}
					{errorMessage && <p className="text-red-600">{errorMessage}</p>}
				</div>
			</form>
		</div>
	);
}
