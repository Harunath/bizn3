"use client";

import { useCallback, useState } from "react";
import { FiTrash } from "react-icons/fi";
import Image from "next/image";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { upload } from "@repo/common/upload";
import { z } from "zod";
import { useSession } from "next-auth/react";

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
	const { data: session } = useSession();
	const [profileImage, setProfileImage] = useState<string | null>(
		profileImageUrl
	);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [password, setPassword] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [open, setOpen] = useState(false);
	const [saving, setSaving] = useState(false);

	const language = "English (IN)";
	const timezone = "Asia/Kolkata";

	const handleImageChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = () => setProfileImage(reader.result as string);
				reader.readAsDataURL(file);
				setSelectedFile(file);
			}
		},
		[]
	);

	const handleSaveImage = useCallback(async () => {
		if (!selectedFile) {
			toast.error("No new image selected.");
			return;
		}

		setSaving(true);
		try {
			const res = await fetch("/api/user/upload-image", { method: "POST" });
			const result = await res.json();
			const { signature, timestamp, folder, apiKey, cloudName } = result;

			const urls = await upload({
				signature,
				files: [selectedFile],
				timestamp,
				folder,
				apiKey,
				cloudName,
			});

			if (urls.length > 0) {
				const uploadedUrl = urls[0];
				const updateRes = await fetch(
					`/api/user/${userId}/my-profile/user-profile/profile-image`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ imageUrl: uploadedUrl }),
					}
				);
				if (!updateRes.ok) throw new Error("Failed to update profile image");

				toast.success("Profile image updated successfully.");
				setSelectedFile(null);
			} else {
				toast.error("Upload failed. No image URL received.");
			}
		} catch (error) {
			const errMsg =
				error instanceof Error ? error.message : "An unknown error occurred.";
			toast.error(errMsg);
		} finally {
			setSaving(false);
		}
	}, [selectedFile, userId]);

	const handleDeleteImage = useCallback(() => {
		setProfileImage(null);
		setSelectedFile(null);
		toast.success("Profile image deleted.");
	}, []);

	const updatePassword = useCallback(async () => {
		const result = passwordSchema.safeParse({ oldPassword, password });
		if (!result.success) {
			toast.error(result.error.errors[0]?.message || "Invalid input.");
			return;
		}
		try {
			const res = await fetch(
				`/api/user/${userId}/my-profile/user-profile/update-password`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ oldPassword, newPassword: password }),
				}
			);
			if (!res.ok) throw new Error(`Error: ${res.statusText}`);
			const response = await res.json();
			toast.success(response.data || "Password updated successfully.");
			setPassword("");
			setOldPassword("");
			setOpen(false);
		} catch (e) {
			const errMsg =
				e instanceof Error ? e.message : "An unknown error occurred.";
			toast.error(errMsg);
		}
	}, [oldPassword, password, userId]);

	return (
		<div className="min-h-screen flex justify-center items-start p-4 sm:p-6">
			<form
				className="w-full max-w-6xl bg-slate-100 p-4 sm:p-4 shadow-xl space-y-6"
				onSubmit={(e) => e.preventDefault()}>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-6">
						{/* Username */}
						<div>
							<label className="block text-gray-700 font-semibold mb-1">
								Username
							</label>
							<div className="text-gray-800 bg-gray-200 rounded px-4 py-2">
								{session?.user?.firstname} {session?.user?.lastname}
							</div>
						</div>

						{/* Password */}
						<div>
							<label className="block text-gray-700 font-semibold mb-1">
								Password
							</label>
							<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
								<input
									type="password"
									value="password"
									className="bg-gray-200 rounded px-4 py-2 flex-1"
									disabled
								/>
								<motion.button
									transition={{ duration: 0.1 }}
									type="button"
									onClick={() => setOpen(true)}
									className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
									Change Password
								</motion.button>
							</div>
						</div>

						{/* Password Modal */}
						{open && (
							<motion.div className="fixed z-50 inset-0 backdrop-blur-md flex items-center justify-center">
								<div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
									<button
										onClick={() => setOpen(false)}
										className="absolute -top-4 -right-4 text-gray-600 bg-white rounded-full p-2 shadow hover:text-red-600">
										✕
									</button>
									<div className="space-y-4">
										<input
											type="password"
											value={oldPassword}
											onChange={(e) => setOldPassword(e.target.value)}
											placeholder="Enter old password"
											className="bg-gray-200 w-full rounded px-4 py-2"
										/>
										<input
											type="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Enter new password"
											className="bg-gray-200 w-full rounded px-4 py-2"
										/>
										<button
											type="button"
											onClick={updatePassword}
											disabled={!password || !oldPassword}
											className={`w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition ${
												!password || !oldPassword
													? "opacity-50 cursor-not-allowed"
													: ""
											}`}>
											Update Password
										</button>
									</div>
								</div>
							</motion.div>
						)}

						{/* Profile Image */}
						<div>
							<label className="block text-gray-700 font-semibold mb-1">
								Profile Image
							</label>
							<div className="flex flex-col sm:flex-row items-start gap-4">
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
										onClick={handleSaveImage}
										disabled={!selectedFile || saving}
										className={`bg-red-600 text-white px-4 py-2 rounded mt-2 flex items-center justify-center gap-2 hover:bg-red-700 transition ${
											!selectedFile || saving
												? "opacity-50 cursor-not-allowed"
												: ""
										}`}>
										{saving ? (
											<svg
												className="animate-spin h-5 w-5 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24">
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												/>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
												/>
											</svg>
										) : (
											"Save Profile Image"
										)}
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Language & Timezone */}
					<div className="space-y-6">
						<div>
							<label className="block text-gray-700 font-semibold mb-1">
								Language
							</label>
							<input
								type="text"
								value={language}
								className="bg-white border border-gray-300 rounded px-4 py-2 w-full"
								disabled
							/>
						</div>
						<div>
							<label className="block text-gray-700 font-semibold mb-1">
								Timezone
							</label>
							<input
								type="text"
								value={timezone}
								className="bg-white border border-gray-300 rounded px-4 py-2 w-full"
								disabled
							/>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
