"use client";

import { useEffect, useState } from "react";

export default function MyBio({ userId }: { userId: string }) {
	const [formData, setFormData] = useState({
		yearsInBusiness: "",
		previousJobs: "",
		hobbies: "",
		interests: "",
		city: "",
		yearsInCity: "",
		burningDesire: "",
		unknownFact: "",
		keyToSuccess: "",
	});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchBio = async () => {
			try {
				const res = await fetch(`/api/user/${userId}/bios/my-bio`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (!res.ok) throw new Error("Failed to fetch bio");
				const data = await res.json();
				setFormData(data);
			} catch (error) {
				console.error("Error fetching bio:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchBio();
	}, [userId]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await fetch(`/api/user/${userId}/bios/my-bio`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			if (!res.ok) throw new Error("Failed to save bio");
			alert("Bio saved successfully!");
		} catch (error) {
			console.error(error);
			alert("An error occurred while saving bio.");
		}
	};

	if (loading) return <div className="p-8 text-center">Loading...</div>;

	return (
		<div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
			<form
				className="w-full max-w-5xl bg-white p-8 rounded-lg shadow space-y-6"
				onSubmit={handleSubmit}>
				{/* Years in Business */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Years In Business
					</label>
					<input
						type="number"
						name="yearsInBusiness"
						value={formData.yearsInBusiness}
						onChange={handleChange}
						className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Previous Types of Jobs */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Previous Types of Jobs
					</label>
					<textarea
						name="previousJobs"
						value={formData.previousJobs}
						onChange={handleChange}
						rows={3}
						className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
					/>
				</div>

				{/* Hobbies & Interests */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block font-semibold text-black mb-1">
							Hobbies
						</label>
						<textarea
							name="hobbies"
							value={formData.hobbies}
							onChange={handleChange}
							rows={3}
							className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
						/>
					</div>
					<div>
						<label className="block font-semibold text-black mb-1">
							Interests
						</label>
						<textarea
							name="interests"
							value={formData.interests}
							onChange={handleChange}
							rows={3}
							className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
						/>
					</div>
				</div>

				{/* City and Years in City */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block font-semibold text-black mb-1">
							City of Residence
						</label>
						<input
							type="text"
							name="city"
							value={formData.city}
							onChange={handleChange}
							className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
						/>
					</div>
					<div>
						<label className="block font-semibold text-black mb-1">
							Years in that City
						</label>
						<input
							type="number"
							name="yearsInCity"
							value={formData.yearsInCity}
							onChange={handleChange}
							className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
						/>
					</div>
				</div>

				{/* Burning Desire */}
				<div>
					<label className="block font-semibold text-black mb-1">
						My Burning Desire is to
					</label>
					<textarea
						name="burningDesire"
						value={formData.burningDesire}
						onChange={handleChange}
						rows={3}
						className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
					/>
				</div>

				{/* Unknown Fact */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Something No One Here Knows About Me
					</label>
					<textarea
						name="unknownFact"
						value={formData.unknownFact}
						onChange={handleChange}
						rows={4}
						className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
					/>
				</div>

				{/* Key to Success */}
				<div>
					<label className="block font-semibold text-black mb-1">
						My Key to Success
					</label>
					<textarea
						name="keyToSuccess"
						value={formData.keyToSuccess}
						onChange={handleChange}
						rows={3}
						className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
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
