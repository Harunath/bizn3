"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function MyBio({ userId }: { userId: string }) {
	const [formData, setFormData] = useState({
		yearsInBusiness: "",
		yearsInCity: "",
		previousJobs: [] as string[],
		burningDesire: "",
		hobbiesIntrests: [] as string[],
		NoOneKnowsAboutMe: "",
		cityOfResidence: "",
		keyToSuccess: "",
		newValues: {
			previousJobs: "",
			hobbiesIntrests: "",
		},
	});

	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(false);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const fetchBio = async () => {
			try {
				const res = await fetch(`/api/user/${userId}/bios/my-bio`);
				if (!res.ok) throw new Error("Failed to fetch bio");

				const response = await res.json();
				const data = response.data;

				setFormData({
					yearsInBusiness: data.yearsInBusiness?.toString() || "",
					yearsInCity: data.yearsInCity?.toString() || "",
					previousJobs: data.previousJobs || [],
					burningDesire: data.burningDesire || "",
					hobbiesIntrests: data.hobbiesIntrests || [],
					NoOneKnowsAboutMe: data.NoOneKnowsAboutMe || "",
					cityOfResidence: data.cityOfResidence || "",
					keyToSuccess: data.keyToSuccess || "",
					newValues: {
						previousJobs: "",
						hobbiesIntrests: "",
					},
				});

				setUpdating(true);
			} catch {
				console.log("No bio found, defaulting to create.");
			} finally {
				setLoading(false);
			}
		};

		fetchBio();
	}, [userId]);

	const handleTempChange = (key: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			newValues: { ...prev.newValues, [key]: value },
		}));
	};

	const handleAddItem = (key: string) => {
		const value =
			formData.newValues[key as "previousJobs" | "hobbiesIntrests"].trim();
		if (!value) return;

		if (!formData[key as "previousJobs" | "hobbiesIntrests"].includes(value)) {
			setFormData((prev) => ({
				...prev,
				[key]: [...(prev[key as keyof typeof formData] as string[]), value],
				newValues: { ...prev.newValues, [key]: "" },
			}));
		}
	};

	const handleRemoveItem = (key: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[key]: (prev[key as keyof typeof formData] as string[]).filter(
				(item) => item !== value
			),
		}));
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);

		try {
			const res = await fetch(`/api/user/${userId}/bios/my-bio`, {
				method: updating ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			if (!res.ok) throw new Error("Failed to save bio");

			toast.success(
				updating
					? "My Bio updated successfully!"
					: "My Bio created successfully!"
			);
		} catch (error) {
			console.error(error);
			toast.error("An error occurred while saving the bio.");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <div className="p-8 text-center">Loading...</div>;

	return (
		<div className="min-h-screen flex justify-center items-start ">
			<form
				className="w-full max-w-5xl bg-slate-100 p-6 md:p-8  shadow-xl space-y-6"
				onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<FormField
						label="Years In Business"
						name="yearsInBusiness"
						type="number"
						value={formData.yearsInBusiness}
						onChange={handleChange}
					/>
					<FormField
						label="Years in that City"
						name="yearsInCity"
						type="number"
						value={formData.yearsInCity}
						onChange={handleChange}
					/>
					<FormField
						label="City of Residence"
						name="cityOfResidence"
						value={formData.cityOfResidence}
						onChange={handleChange}
					/>
				</div>

				<TextAreaField
					label="My Burning Desire is to"
					name="burningDesire"
					value={formData.burningDesire}
					onChange={handleChange}
				/>
				<TextAreaField
					label="Something No One Here Knows About Me"
					name="NoOneKnowsAboutMe"
					value={formData.NoOneKnowsAboutMe}
					onChange={handleChange}
				/>
				<TextAreaField
					label="My Key to Success"
					name="keyToSuccess"
					value={formData.keyToSuccess}
					onChange={handleChange}
				/>

				<ArrayInputField
					label="Previous Jobs"
					fieldKey="previousJobs"
					values={formData.previousJobs}
					tempValue={formData.newValues.previousJobs}
					onTempChange={handleTempChange}
					onAdd={handleAddItem}
					onRemove={handleRemoveItem}
				/>
				<ArrayInputField
					label="Hobbies & Interests"
					fieldKey="hobbiesIntrests"
					values={formData.hobbiesIntrests}
					tempValue={formData.newValues.hobbiesIntrests}
					onTempChange={handleTempChange}
					onAdd={handleAddItem}
					onRemove={handleRemoveItem}
				/>

				<div className="flex justify-end pt-6">
					<button
						type="submit"
						disabled={saving}
						className={`px-6 py-2 rounded font-semibold text-white ${
							updating ? "bg-red-600" : "bg-black"
						} hover:opacity-90 disabled:opacity-50`}>
						{saving
							? updating
								? "Updating..."
								: "Saving..."
							: updating
								? "Update"
								: "Save"}
					</button>
				</div>
			</form>
		</div>
	);
}

function FormField({
	label,
	name,
	value,
	onChange,
	type = "text",
}: {
	label: string;
	name: string;
	value: string | number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	type?: "text" | "number";
}) {
	return (
		<div>
			<label className="block font-semibold text-black mb-1">{label}</label>
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				className="w-full bg-white border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
			/>
		</div>
	);
}

function TextAreaField({
	label,
	name,
	value,
	onChange,
}: {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
	return (
		<div>
			<label className="block font-semibold text-black mb-1">{label}</label>
			<textarea
				name={name}
				value={value}
				onChange={onChange}
				rows={3}
				className="w-full bg-white border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
			/>
		</div>
	);
}

type ArrayInputFieldProps = {
	label: string;
	fieldKey: string;
	values: string[];
	tempValue: string;
	onTempChange: (key: string, value: string) => void;
	onAdd: (key: string) => void;
	onRemove: (key: string, value: string) => void;
	placeholder?: string;
};

const ArrayInputField: React.FC<ArrayInputFieldProps> = ({
	label,
	fieldKey,
	values,
	tempValue,
	onTempChange,
	onAdd,
	onRemove,
	placeholder = "Type and press Enter",
}) => {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			onAdd(fieldKey);
		}
	};

	return (
		<div className="mb-4">
			<label className="block font-semibold text-black mb-1">{label}</label>
			<div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-2">
				<input
					type="text"
					value={tempValue}
					onChange={(e) => onTempChange(fieldKey, e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					className="flex-grow bg-white border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
				/>
				<button
					type="button"
					onClick={() => onAdd(fieldKey)}
					className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
					Add
				</button>
			</div>
			<div className="flex flex-wrap gap-2">
				{values.map((val, idx) => (
					<span
						key={idx}
						className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-full text-sm">
						{val}
						<button
							type="button"
							onClick={() => onRemove(fieldKey, val)}
							className="text-red-600 hover:text-red-800">
							&times;
						</button>
					</span>
				))}
			</div>
		</div>
	);
};
