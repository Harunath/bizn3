"use client";

import { useEffect, useState } from "react";

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

				const response = await res.json();
				const data = response.data; // ✅ extract actual data

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
			} catch (error) {
				console.error("Error fetching bio:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchBio();
	}, [userId]);

	const handleTempChange = (key: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			newValues: {
				...prev.newValues,
				[key]: value,
			},
		}));
	};

	const handleAddItem = (key: string) => {
		console.log("Adding item to", key);
		const value =
			formData.newValues[key as "previousJobs" | "hobbiesIntrests"].trim();
		if (!value) return;

		if (!formData[key as "previousJobs" | "hobbiesIntrests"].includes(value)) {
			setFormData((prev) => ({
				...prev,
				[key]: [...(prev[key as keyof typeof formData] as string[]), value],
				newValues: {
					...prev.newValues,
					[key]: "",
				},
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

				{/* City and Years in City */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block font-semibold text-black mb-1">
							City of Residence
						</label>
						<input
							type="text"
							name="cityOfResidence"
							value={formData.cityOfResidence}
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
						name="NoOneKnowsAboutMe"
						value={formData.NoOneKnowsAboutMe}
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
			<div className="flex items-center gap-2 mb-2">
				<input
					type="text"
					value={tempValue}
					onChange={(e) => onTempChange(fieldKey, e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					className="flex-grow border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
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
