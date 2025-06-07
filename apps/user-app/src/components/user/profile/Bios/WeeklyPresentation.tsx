"use client";

import { useEffect, useState } from "react";

export default function WeeklyPresentation({ userId }: { userId: string }) {
	const [formData, setFormData] = useState({
		weeklyPresentation1: "",
		weeklyPresentation2: "",
	});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(
					`/api/user/${userId}/bios/weekly-presentation`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				if (!res.ok) throw new Error("Failed to fetch data");
				const data = await res.json();
				setFormData(data);
			} catch (error) {
				console.error("Error fetching weekly presentation:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [userId]);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.weeklyPresentation1.trim()) {
			alert("Weekly Presentation 1 is required.");
			return;
		}

		try {
			const res = await fetch(`/api/user/${userId}/bios/weekly-presentation`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!res.ok) throw new Error("Failed to save data");
			alert("Presentations saved successfully!");
		} catch (error) {
			console.error("Error saving data:", error);
			alert("Something went wrong while saving the presentations.");
		}
	};

	if (loading) return <div className="p-8 text-center">Loading...</div>;

	return (
		<div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-3xl bg-white p-8 rounded-lg shadow space-y-6">
				{/* Weekly Presentation 1 */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Weekly Presentation 1
					</label>
					<textarea
						name="weeklyPresentation1"
						value={formData.weeklyPresentation1}
						onChange={handleChange}
						rows={4}
						required
						placeholder="PUBLIC SPEAKING"
						className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Weekly Presentation 2 */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Weekly Presentation 2
					</label>
					<textarea
						name="weeklyPresentation2"
						value={formData.weeklyPresentation2}
						onChange={handleChange}
						rows={4}
						placeholder="SOFT SKILLS"
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
