"use client";

import { useEffect, useState } from "react";

export default function TopsProfile({ userId }: { userId: string }) {
	const [formData, setFormData] = useState({
		idealReferral: [] as string[],
		topProduct: [] as string[],
		topProblemSolved: [] as string[],
		story: [] as string[],
		idealReferralPartner: [] as string[],
	});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await fetch(`/api/user/${userId}/bios/top-profile`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (!res.ok) throw new Error("Failed to fetch profile");
				const data = await res.json();
				setFormData({
					idealReferral: data.data.idealReferral || [],
					topProduct: data.data.topProduct || [],
					topProblemSolved: data.data.topProblemSolved || [],
					story: data.data.story || [],
					idealReferralPartner: data.data.idealReferralPartner || [],
				});
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
		const lines = value
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean);
		setFormData((prev) => ({ ...prev, [name]: lines }));
	};

	const formatArray = (arr: string[]) => arr.join("\n");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await fetch(`/api/user/${userId}/bios/top-profile`, {
				method: "POST",
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
						value={formatArray(formData.idealReferral)}
						onChange={handleChange}
						rows={4}
						placeholder="Describe your ideal referral (one per line)..."
						className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Top Product */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Top Product
					</label>
					<textarea
						name="topProduct"
						value={formatArray(formData.topProduct)}
						onChange={handleChange}
						rows={3}
						placeholder="List your top products or services (one per line)..."
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
						value={formatArray(formData.topProblemSolved)}
						onChange={handleChange}
						rows={4}
						placeholder="Explain the key problems you've solved (one per line)..."
						className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* BNI Story */}
				<div>
					<label className="block font-semibold text-black mb-1">
						My Favourite BNI Story
					</label>
					<textarea
						name="story"
						value={formatArray(formData.story)}
						onChange={handleChange}
						rows={4}
						placeholder="Share your favorite BNI experiences (one per line)..."
						className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Ideal Referral Partner */}
				<div>
					<label className="block font-semibold text-black mb-1">
						My Ideal Referral Partner
					</label>
					<textarea
						name="idealReferralPartner"
						value={formatArray(formData.idealReferralPartner)}
						onChange={handleChange}
						rows={3}
						placeholder="List ideal partners you'd like to work with (one per line)..."
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
