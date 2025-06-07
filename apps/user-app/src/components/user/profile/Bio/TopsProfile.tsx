"use client";

import { useEffect, useState } from "react";

export default function TopsProfile() {
	const userId = "123"; // Replace with dynamic ID if needed

	const [formData, setFormData] = useState({
		idealReferral: "",
		topProducts: "",
		topProblemSolved: "",
		bniStory: "",
		referralPartners: "",
	});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await fetch(`/api/user/${userId}/bios/tops-profile`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (!res.ok) throw new Error("Failed to fetch profile");
				const data = await res.json();
				setFormData(data);
			} catch (error) {
				console.error("Error fetching profile:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [userId]);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await fetch(`/api/user/${userId}/bios/tops-profile`, {
				method: "POST", // or PUT if your backend uses it
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			if (!res.ok) throw new Error("Failed to save profile");
			alert("Profile saved successfully!");
		} catch (error) {
			console.error(error);
			alert("An error occurred while saving profile.");
		}
	};

	if (loading) return <div className="p-8 text-center">Loading...</div>;

	return (
		<div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
			<form
				className="w-full max-w-5xl bg-white p-8 rounded-lg shadow space-y-6"
				onSubmit={handleSubmit}>
				{/* Ideal Referral */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Ideal Referral
					</label>
					<textarea
						name="idealReferral"
						value={formData.idealReferral}
						onChange={handleChange}
						rows={4}
						placeholder="Describe your ideal referral..."
						className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Top Product */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Top Product
					</label>
					<textarea
						name="topProducts"
						value={formData.topProducts}
						onChange={handleChange}
						rows={3}
						placeholder="List your top products or services..."
						className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Top Problem Solved */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Top Problem Solved
					</label>
					<textarea
						name="topProblemSolved"
						value={formData.topProblemSolved}
						onChange={handleChange}
						rows={4}
						placeholder="Explain the key problems you've solved..."
						className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* BNI Story */}
				<div>
					<label className="block font-semibold text-black mb-1">
						My Favourite BNI Story
					</label>
					<textarea
						name="bniStory"
						value={formData.bniStory}
						onChange={handleChange}
						rows={4}
						placeholder="Share your favorite BNI experience..."
						className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Ideal Referral Partner */}
				<div>
					<label className="block font-semibold text-black mb-1">
						My Ideal Referral Partner
					</label>
					<textarea
						name="referralPartners"
						value={formData.referralPartners}
						onChange={handleChange}
						rows={3}
						placeholder="List ideal partners you'd like to work with..."
						className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Actions */}
				<div className="flex justify-end gap-4 pt-6">
					<button
						type="submit"
						className="bg-black text-white px-6 py-2 rounded hover:opacity-90 font-semibold">
						Save
					</button>
				</div>
			</form>
		</div>
	);
}
