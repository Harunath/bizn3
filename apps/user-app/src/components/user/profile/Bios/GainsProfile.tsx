"use client";

import { useEffect, useState } from "react";

export default function GainsProfile({ userId }: { userId: string }) {
	const [formData, setFormData] = useState({
		goals: [] as string[],
		accomplishments: [] as string[],
		interests: [] as string[],
		networks: [] as string[],
		skills: [] as string[],
		newInterest: "",
	});

	const [loading, setLoading] = useState(true);
	const [isEditMode, setIsEditMode] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await fetch(`/api/user/${userId}/bios/gains-profile`);
				if (res.ok) {
					const data = await res.json();
					setFormData((prev) => ({
						...prev,
						goals: data.data.goals || [],
						accomplishments: data.data.accomplishments || [],
						interests: data.data.interests || data.data.intrests || [],
						networks: data.data.networks || [],
						skills: data.data.skills || [],
					}));
					setIsEditMode(true);
				}
			} catch (err) {
				console.error("Fetch error:", err);
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


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const res = await fetch(`/api/user/${userId}/bios/gains-profile`, {
				method: isEditMode ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					goals: formData.goals,
					accomplishments: formData.accomplishments,
					networks: formData.networks,
					skills: formData.skills,
					intrests: formData.interests, // Send as 'intrests' due to schema typo
				}),
			});
			if (!res.ok) throw new Error("Failed to submit");
			alert("Profile saved successfully!");
		} catch (error) {
			console.error("Save error:", error);
			alert("An error occurred while saving profile.");
		} finally {
			setSubmitting(false);
		}
	};

	const handleAddInterest = () => {
		const interest = formData.newInterest.trim();
		if (interest && !formData.interests.includes(interest)) {
			setFormData((prev) => ({
				...prev,
				interests: [...prev.interests, interest],
				newInterest: "",
			}));
		}
	};

	const handleRemoveInterest = (item: string) => {
		setFormData((prev) => ({
			...prev,
			interests: prev.interests.filter((i) => i !== item),
		}));
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddInterest();
		}
	};

	if (loading) return <div className="p-8 text-center">Loading...</div>;

	return (
		<div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-5xl bg-white p-8 rounded-lg shadow space-y-6">
				{/* Goals */}
				<TextareaField name="goals" label="Goals" value={formData.goals} onChange={handleChange} required />

				{/* Accomplishments */}
				<TextareaField name="accomplishments" label="Accomplishments" value={formData.accomplishments} onChange={handleChange} />

				{/* Interests - Converted to tag-style input */}
				<div>
					<label className="block font-semibold text-black mb-1">Interests</label>
					<div className="flex items-center gap-2 mb-2">
						<input
							type="text"
							value={formData.newInterest}
							onChange={(e) => setFormData((prev) => ({ ...prev, newInterest: e.target.value }))}
							onKeyDown={handleKeyDown}
							placeholder="Type and press Enter"
							className="flex-grow border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
						/>
						<button
							type="button"
							onClick={handleAddInterest}
							className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
							Add
						</button>
					</div>
					<div className="flex flex-wrap gap-2">
						{formData.interests.map((item, idx) => (
							<span key={idx} className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-full text-sm">
								{item}
								<button
									type="button"
									onClick={() => handleRemoveInterest(item)}
									className="text-red-600 hover:text-red-800">
									&times;
								</button>
							</span>
						))}
					</div>
				</div>

				{/* Networks */}
				<TextareaField name="networks" label="Networks" value={formData.networks} onChange={handleChange} />

				{/* Skills */}
				<TextareaField name="skills" label="Skills" value={formData.skills} onChange={handleChange} />

				{/* Submit */}
				<div className="flex justify-end gap-4 pt-6">
					<button
						type="submit"
						disabled={submitting}
						className="bg-red-600 text-white px-6 py-2 rounded hover:opacity-90 font-semibold">
						{isEditMode ? "Update" : "Save"}
					</button>
				</div>
			</form>
		</div>
	);
}

function TextareaField({
	name,
	label,
	value,
	onChange,
	required = false,
}: {
	name: string;
	label: string;
	value: string[];
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	required?: boolean;
}) {
	return (
		<div>
			<label className="block font-semibold text-black mb-1">
				{label}
				{required && <span className="text-red-600">*</span>}
			</label>
			<textarea
				name={name}
				value={value.join("\n")}
				onChange={onChange}
				rows={4}
				required={required}
				placeholder={`Enter ${label.toLowerCase()} (one per line)...`}
				className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
			/>
		</div>
	);
}
