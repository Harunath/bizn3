"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function TopsProfile({ userId }: { userId: string }) {
	const [formData, setFormData] = useState({
		idealReferral: [] as string[],
		topProduct: [] as string[],
		topProblemSolved: [] as string[],
		story: [] as string[],
		idealReferralPartner: [] as string[],
	});

	const [loading, setLoading] = useState(true);
	const [isEditMode, setIsEditMode] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await fetch(`/api/user/${userId}/bios/top-profile`, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});
				if (res.status === 200) {
					const data = await res.json();
					setFormData({
						idealReferral: data.data.idealReferral || [],
						topProduct: data.data.topProduct || [],
						topProblemSolved: data.data.topProblemSolved || [],
						story: data.data.story || [],
						idealReferralPartner: data.data.idealReferralPartner || [],
					});
					setIsEditMode(true);
				}
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
		setSubmitting(true);

		try {
			const res = await fetch(`/api/user/${userId}/bios/top-profile`, {
				method: isEditMode ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			if (!res.ok) throw new Error("Failed to save profile");

			toast.success(
				isEditMode
					? "Tops Profile updated successfully!"
					: "Tops Profile saved successfully!"
			);

			if (!isEditMode) setIsEditMode(true);
		} catch (error) {
			console.error(error);
			toast.error("An error occurred while saving Tops Profile.");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return <div className="p-8 text-center">Loading...</div>;

	return (
		<div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
			<form
				className="w-full max-w-5xl bg-white p-8 rounded-lg shadow space-y-6"
				onSubmit={handleSubmit}>
				{/* Ideal Referral */}
				<TextAreaField
					label="Ideal Referral"
					name="idealReferral"
					value={formatArray(formData.idealReferral)}
					onChange={handleChange}
					placeholder="Describe your ideal referral (one per line)..."
				/>

				{/* Top Product */}
				<TextAreaField
					label="Top Product"
					name="topProduct"
					value={formatArray(formData.topProduct)}
					onChange={handleChange}
					placeholder="List your top products or services (one per line)..."
				/>

				{/* Top Problem Solved */}
				<TextAreaField
					label="Top Problem Solved"
					name="topProblemSolved"
					value={formatArray(formData.topProblemSolved)}
					onChange={handleChange}
					placeholder="Explain the key problems you've solved (one per line)..."
				/>

				{/* BNI Story */}
				<TextAreaField
					label="My Favourite BNI Story"
					name="story"
					value={formatArray(formData.story)}
					onChange={handleChange}
					placeholder="Share your favorite BNI experiences (one per line)..."
				/>

				{/* Ideal Referral Partner */}
				<TextAreaField
					label="My Ideal Referral Partner"
					name="idealReferralPartner"
					value={formatArray(formData.idealReferralPartner)}
					onChange={handleChange}
					placeholder="List ideal partners you'd like to work with (one per line)..."
				/>

				{/* Submit Button */}
				<div className="flex justify-end pt-6">
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
		</div>
	);
}

type TextAreaFieldProps = {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	placeholder?: string;
};

const TextAreaField: React.FC<TextAreaFieldProps> = ({
	label,
	name,
	value,
	onChange,
	placeholder = "",
}) => (
	<div>
		<label className="block font-semibold text-black mb-1">{label}</label>
		<textarea
			name={name}
			value={value}
			onChange={onChange}
			rows={4}
			placeholder={placeholder}
			className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
		/>
	</div>
);
