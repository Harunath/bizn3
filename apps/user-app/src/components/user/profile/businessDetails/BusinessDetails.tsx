"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
		keywords: [] as string[],
		newKeyword: "",
		BusinessDescription: "",
		companyLogoUrl: "",
		generalCategory: "",
	});

	const [exist, setExist] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const session = useSession();
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		if (session.status === "authenticated" && session.data.user?.id) {
			setUserId(session.data.user.id);
		}
	}, [session]);

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
					const cleaned = { ...data.data };
					delete cleaned.createdAt;
					delete cleaned.updatedAt;

					setFormData({
						...cleaned,
						keywords: cleaned.keywords ? cleaned.keywords.split(",") : [],
						newKeyword: "",
					});
					setExist(true);
				}
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Something went wrong"
				);
			} finally {
				setInitialLoading(false);
			}
		};
		fetchBusinessDetails();
	}, [userId]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({ ...prev, newKeyword: e.target.value }));
	};

	const handleAddKeyword = () => {
		const keyword = formData.newKeyword.trim();
		if (keyword && !formData.keywords.includes(keyword)) {
			setFormData((prev) => ({
				...prev,
				keywords: [...prev.keywords, keyword],
				newKeyword: "",
			}));
		}
	};

	const handleRemoveKeyword = (keywordToRemove: string) => {
		setFormData((prev) => ({
			...prev,
			keywords: prev.keywords.filter((kw) => kw !== keywordToRemove),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!userId) return;
		setIsSubmitting(true);

		try {
			const payload = {
				...formData,
				keywords: formData.keywords.join(","),
				newKeyword: undefined,
			};
			const res = await fetch(`/api/user/${userId}/business`, {
				method: exist ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.message);

			const cleaned = { ...json.data };
			delete cleaned.createdAt;
			delete cleaned.updatedAt;

			setFormData({
				...cleaned,
				keywords: cleaned.keywords?.split(",") || [],
				newKeyword: "",
			});
			setExist(true);
			toast.success("Business details updated successfully.");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Something went wrong"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (initialLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-white">
				<div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex justify-center items-start p-6">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-5xl bg-slate-100 p-8 shadow-xl space-y-8">
				<h2 className="text-2xl font-bold text-black mb-4">Business Details</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{Object.entries(formData).map(([key, value]) => {
						if (
							[
								"images",
								"companyLogoUrl",
								"keywords",
								"newKeyword",
								"panNumberVerified",
								"gstNumberVerified",
								"verified",
								"id",
								"userId",
								"categoryId",
							].includes(key)
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
									value={
										typeof value === "string"
											? value
											: Array.isArray(value)
												? value.join(", ")
												: typeof value === "boolean"
													? value
														? "Yes"
														: "No"
													: (value ?? "")
									}
									onChange={handleChange}
									className="block w-full bg-white rounded border border-gray-400 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 hover:border-red-600 transition"
									placeholder={`Enter ${key}`}
								/>
							</div>
						);
					})}
				</div>

				<div>
					<label className="block font-semibold text-black mb-1">
						Keywords
					</label>
					<div className="flex flex-col sm:flex-row sm:items-center items-start gap-2 mb-2">
						<input
							type="text"
							placeholder="Type and press Enter"
							value={formData.newKeyword}
							onChange={handleKeywordChange}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleAddKeyword();
								}
							}}
							className="flex-grow bg-white border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
						/>
						<button
							type="button"
							onClick={handleAddKeyword}
							className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
							Add
						</button>
					</div>
					<div className="flex flex-wrap gap-2">
						{formData.keywords.map((kw, idx) => (
							<span
								key={idx}
								className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-full text-sm">
								{kw}
								<button
									type="button"
									onClick={() => handleRemoveKeyword(kw)}
									className="text-red-600 hover:text-red-800">
									&times;
								</button>
							</span>
						))}
					</div>
				</div>

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

				<div className="flex justify-end pt-4">
					<button
						type="submit"
						disabled={isSubmitting}
						className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold disabled:opacity-50 transition">
						{isSubmitting ? "Updating..." : exist ? "Update" : "Save"}
					</button>
				</div>

				<ToastContainer
					position="top-right"
					autoClose={3000}
					hideProgressBar={false}
					closeOnClick
					pauseOnHover
					draggable
					theme="light"
				/>
			</form>
		</div>
	);
}
