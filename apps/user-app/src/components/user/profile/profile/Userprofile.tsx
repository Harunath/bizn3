"use client";

import { useState } from "react";
import { FiTrash } from "react-icons/fi";
import Image from "next/image";

export default function ProfileForm() {
	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [language, setLanguage] = useState("English (IN)");
	const [timezone, setTimezone] = useState("Asia/Kolkata");

	// For feedback messages
	const [statusMessage, setStatusMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setProfileImage(reader.result as string);
			reader.readAsDataURL(file);
		}
	};

	const handleDeleteImage = () => {
		setProfileImage(null);
		setStatusMessage("Profile image deleted.");
	};

	// Utility function to simulate API POST calls
	async function postData(url = "", data = {}) {
		try {
			const res = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error(`Error: ${res.statusText}`);
			return await res.json();
		} catch (error: any) {
			throw new Error(error.message || "Unknown error");
		}
	}

	// Handlers for update buttons
	const updateUsername = async () => {
		setStatusMessage(null);
		setErrorMessage(null);
		if (!username.trim()) {
			setErrorMessage("Username cannot be empty.");
			return;
		}
		try {
			await postData("/api/update-username", { username });
			setStatusMessage("Username updated successfully.");
		} catch (e: any) {
			setErrorMessage(e.message);
		}
	};

	const updatePassword = async () => {
		setStatusMessage(null);
		setErrorMessage(null);
		if (!password.trim()) {
			setErrorMessage("Password cannot be empty.");
			return;
		}
		try {
			await postData("/api/update-password", { password });
			setStatusMessage("Password updated successfully.");
		} catch (e: any) {
			setErrorMessage(e.message);
		}
	};

	const updateLanguage = async () => {
		setStatusMessage(null);
		setErrorMessage(null);
		if (!language.trim()) {
			setErrorMessage("Language cannot be empty.");
			return;
		}
		try {
			await postData("/api/update-language", { language });
			setStatusMessage("Language updated successfully.");
		} catch (e: any) {
			setErrorMessage(e.message);
		}
	};

	const updateTimezone = async () => {
		setStatusMessage(null);
		setErrorMessage(null);
		if (!timezone.trim()) {
			setErrorMessage("Timezone cannot be empty.");
			return;
		}
		try {
			await postData("/api/update-timezone", { timezone });
			setStatusMessage("Timezone updated successfully.");
		} catch (e: any) {
			setErrorMessage(e.message);
		}
	};

	const updateProfileImage = async () => {
		setStatusMessage(null);
		setErrorMessage(null);
		if (!profileImage) {
			setErrorMessage("No profile image to update.");
			return;
		}
		try {
			await postData("/api/update-profile-image", { profileImage });
			setStatusMessage("Profile image updated successfully.");
		} catch (e: any) {
			setErrorMessage(e.message);
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
							<div className="flex items-center gap-4">
								<input
									type="email"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder="Enter new username"
									className="bg-gray-200 rounded px-4 py-2 flex-1 focus:outline-none"
								/>
								<button
									type="button"
									onClick={updateUsername}
									className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
									Change Username
								</button>
							</div>
						</div>

						<div>
							<label className="block text-gray-700 font-semibold mb-1">
								Password
							</label>
							<div className="flex items-center gap-4">
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
									className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
									Change Password
								</button>
							</div>
						</div>

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
										onClick={updateProfileImage}
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
								/>
								<button
									type="button"
									onClick={updateLanguage}
									className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
									Change Language
								</button>
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
								/>
								<button
									type="button"
									onClick={updateTimezone}
									className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
									Change Timezone
								</button>
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
