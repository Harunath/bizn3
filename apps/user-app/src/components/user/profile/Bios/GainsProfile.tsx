"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function GainsProfile({ userId }: { userId: string }) {
	const [formData, setFormData] = useState({
		goals: "",
		accomplishments: "",
		networks: "",
		skills: "",
		interests: [] as string[],
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
						goals: (data.data.goals || []).join("\n"),
						accomplishments: (data.data.accomplishments || []).join("\n"),
						networks: (data.data.networks || []).join("\n"),
						skills: (data.data.skills || []).join("\n"),
						interests: data.data.interests || data.data.intrests || [],
					}));
					setIsEditMode(true);
				}
			} catch (err) {
				console.error("Fetch error:", err);
				toast.error("Failed to load Gains Profile");
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
		setSubmitting(true);

		try {
			const payload = {
				goals: formData.goals
					.split("\n")
					.map((s) => s.trim())
					.filter(Boolean),
				accomplishments: formData.accomplishments
					.split("\n")
					.map((s) => s.trim())
					.filter(Boolean),
				networks: formData.networks
					.split("\n")
					.map((s) => s.trim())
					.filter(Boolean),
				skills: formData.skills
					.split("\n")
					.map((s) => s.trim())
					.filter(Boolean),
				intrests: formData.interests,
			};

			const res = await fetch(`/api/user/${userId}/bios/gains-profile`, {
				method: isEditMode ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) throw new Error("Failed to submit");

			toast.success(
				isEditMode
					? "Gains Profile updated successfully!"
					: "Gains Profile saved successfully!"
			);
			if (!isEditMode) setIsEditMode(true);
		} catch (error) {
			console.error("Save error:", error);
			toast.error("An error occurred while saving Gains Profile.");
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

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full max-w-5xl bg-slate-100 p-6 md:p-8 shadow-xl space-y-6 mx-auto">
			<TextareaField
				name="goals"
				label="Goals"
				value={formData.goals}
				onChange={handleChange}
				required
			/>

			<TextareaField
				name="accomplishments"
				label="Accomplishments"
				value={formData.accomplishments}
				onChange={handleChange}
			/>

			{/* Interests Section */}
			<div>
				<label className="block font-semibold text-black mb-1">Interests</label>
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-2">
					<input
						type="text"
						value={formData.newInterest}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								newInterest: e.target.value,
							}))
						}
						onKeyDown={handleKeyDown}
						placeholder="Type and press Enter"
						className="flex-grow bg-white border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
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
						<span
							key={idx}
							className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-full text-sm">
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

			<TextareaField
				name="networks"
				label="Networks"
				value={formData.networks}
				onChange={handleChange}
			/>

			<TextareaField
				name="skills"
				label="Skills"
				value={formData.skills}
				onChange={handleChange}
			/>

			<div className="flex justify-end pt-4">
				<button
					type="submit"
					disabled={submitting}
					className="bg-red-600 text-white px-6 py-2 rounded hover:opacity-90 font-semibold disabled:opacity-50">
					{submitting
						? isEditMode
							? "Updating..."
							: "Saving..."
						: isEditMode
							? "Update"
							: "Save"}
				</button>
			</div>
		</form>
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
	value: string;
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
				value={value}
				onChange={onChange}
				rows={4}
				required={required}
				placeholder={`Enter ${label.toLowerCase()} (one per line)...`}
				className="w-full bg-white border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
			/>
		</div>
	);
}
