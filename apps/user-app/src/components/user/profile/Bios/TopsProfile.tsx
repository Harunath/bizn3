"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function TopsProfile({ userId }: { userId: string }) {
	const [formData, setFormData] = useState({
		idealReferral: "",
		topProduct: "",
		topProblemSolved: "",
		story: "",
		idealReferralPartner: "",
	});

	const [loading, setLoading] = useState(true);
	const [isEditMode, setIsEditMode] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await fetch(`/api/user/${userId}/bios/top-profile`);
				if (res.status === 200) {
					const data = await res.json();
					setFormData({
						idealReferral: (data.data.idealReferral || []).join("\n"),
						topProduct: (data.data.topProduct || []).join("\n"),
						topProblemSolved: (data.data.topProblemSolved || []).join("\n"),
						story: (data.data.story || []).join("\n"),
						idealReferralPartner: (data.data.idealReferralPartner || []).join(
							"\n"
						),
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
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);

		const payload = {
			idealReferral: formData.idealReferral
				.split("\n")
				.map((s) => s.trim())
				.filter(Boolean),
			topProduct: formData.topProduct
				.split("\n")
				.map((s) => s.trim())
				.filter(Boolean),
			topProblemSolved: formData.topProblemSolved
				.split("\n")
				.map((s) => s.trim())
				.filter(Boolean),
			story: formData.story
				.split("\n")
				.map((s) => s.trim())
				.filter(Boolean),
			idealReferralPartner: formData.idealReferralPartner
				.split("\n")
				.map((s) => s.trim())
				.filter(Boolean),
		};

		try {
			const res = await fetch(`/api/user/${userId}/bios/top-profile`, {
				method: isEditMode ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
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
			<TextAreaField
				label="Ideal Referral"
				name="idealReferral"
				value={formData.idealReferral}
				onChange={handleChange}
				placeholder="Describe your ideal referral (one per line)..."
			/>

			<TextAreaField
				label="Top Product"
				name="topProduct"
				value={formData.topProduct}
				onChange={handleChange}
				placeholder="List your top products or services (one per line)..."
			/>

			<TextAreaField
				label="Top Problem Solved"
				name="topProblemSolved"
				value={formData.topProblemSolved}
				onChange={handleChange}
				placeholder="Explain the key problems you've solved (one per line)..."
			/>

			<TextAreaField
				label="My Favourite Biz-Network Story"
				name="story"
				value={formData.story}
				onChange={handleChange}
				placeholder="Share your favorite Biz-Network experiences (one per line)..."
			/>

			<TextAreaField
				label="My Ideal Referral Partner"
				name="idealReferralPartner"
				value={formData.idealReferralPartner}
				onChange={handleChange}
				placeholder="List ideal partners you'd like to work with (one per line)..."
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

function TextAreaField({
	label,
	name,
	value,
	onChange,
	placeholder = "",
}: {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	placeholder?: string;
}) {
	return (
		<div>
			<label className="block font-semibold text-black mb-1">{label}</label>
			<textarea
				name={name}
				value={value}
				onChange={onChange}
				rows={4}
				placeholder={placeholder}
				className="w-full bg-white border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
			/>
		</div>
	);
}
