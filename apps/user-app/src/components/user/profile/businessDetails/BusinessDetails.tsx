"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function BusinessDetails() {
	const [formData, setFormData] = useState({
		businessName: "",
		companyName: "",
		images: [] as string[],
		panNumber: "",
		panNumberVerified: false,
		tanNumber: "",
		gstNumber: "",
		gstNumberVerified: false,
		gstRegisteredState: "",
		verified: false,
		keywords: "",
		BusinessDescription: "",
		companyLogoUrl: "",
		generalCategory: "",
		categoryId: "",
	});

	const [exist, setExist] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true); // only for fetching
	const [isSubmitting, setIsSubmitting] = useState(false); // for save/update button
	const [message, setMessage] = useState("");
	const session = useSession();
	const [userId, setUserId] = useState<string | null>(null);

	// Get userId from session
	useEffect(() => {
		if (session.status === "authenticated" && session.data.user?.id) {
			setUserId(session.data.user.id);
		}
	}, [session]);

	// Fetch existing business data
	useEffect(() => {
		if (!userId) return;

		const fetchBusinessDetails = async () => {
			try {
				const res = await fetch(`/api/user/${userId}/business`, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});

				if (!res.ok) throw new Error("Failed to fetch business details");

				const data = await res.json();
				if (data?.data) {
					setFormData(data.data);
					setExist(true);
				}
			} catch (error) {
				console.error("Error fetching business details:", error);
				setMessage(
					error instanceof Error ? error.message : "Something went wrong"
				);
			} finally {
				setInitialLoading(false);
			}
		};

		fetchBusinessDetails();
	}, [userId]);

	// Handle input change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Handle submit
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!userId) return;

		setIsSubmitting(true);
		setMessage("");

		try {
			const res = await fetch(`/api/user/${userId}/business`, {
				method: exist ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const text = await res.text();
			let json;
			try {
				json = text ? JSON.parse(text) : null;
			} catch {
				throw new Error("Invalid JSON response from server");
			}

			if (!res.ok) {
				throw new Error(json?.error || "Failed to save business details");
			}

			if (json?.data) {
				setFormData(json.data);
			}

			setMessage("Business details saved successfully.");
			setExist(true);
		} catch (error) {
			setMessage(
				error instanceof Error ? error.message : "Something went wrong"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Show loader while data loads initially
	if (initialLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
				<p className="text-lg text-gray-600">Loading business details...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-xl space-y-8">
				<h2 className="text-2xl font-bold text-black mb-4">Business Details</h2>

				{/* Text Fields */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{Object.entries(formData).map(([key, value]) => {
						if (
							key === "images" ||
							key === "companyLogoUrl" ||
							typeof value === "boolean" ||
							key === "id" ||
							key === "userId"
						)
							return null;

						return (
							<div key={key}>
								<label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">
									{key.replace(/([A-Z])/g, " $1").trim()}
								</label>
								<input
									type="text"
									name={key}
									value={value || ""}
									onChange={handleChange}
									className="block w-full rounded border border-gray-400 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 hover:border-red-600 transition"
									placeholder={`Enter ${key}`}
								/>
							</div>
						);
					})}
				</div>

				{/* Company Logo */}
				{formData.companyLogoUrl && (
					<div>
						<h3 className="text-lg font-semibold text-gray-700 mb-2">
							Company Logo
						</h3>
						<Image
							src={formData.companyLogoUrl}
							alt="Company Logo"
							width={200}
							height={100}
							className="rounded border shadow"
						/>
					</div>
				)}

				{/* Business Images */}
				{formData.images.length > 0 && (
					<div>
						<h3 className="text-lg font-semibold text-gray-700 mb-2">
							Business Images
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							{formData.images.map((img, i) => (
								<Image
									key={i}
									src={img}
									alt={`Business image ${i + 1}`}
									width={300}
									height={200}
									className="border object-cover"
								/>
							))}
						</div>
					</div>
				)}

				{/* Submit Button */}
				<div className="flex justify-end pt-4">
					<button
						type="submit"
						disabled={isSubmitting}
						className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold disabled:opacity-50 transition">
						{isSubmitting ? "Updating..." : exist ? "Update" : "Save"}
					</button>
				</div>

				{/* Status Message */}
				{message && (
					<p
						className={`mt-2 text-sm font-medium ${
							message.includes("success") ? "text-green-700" : "text-red-700"
						}`}>
						{message}
					</p>
				)}
			</form>
		</div>
	);
}
