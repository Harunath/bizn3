"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface WeeklyPresentationProps {
	userId: string;
}

type Presentation = {
	id?: string;
	title: string;
	descriptions: string;
	error?: string;
	success?: boolean;
};

export default function WeeklyPresentation({
	userId,
}: WeeklyPresentationProps) {
	const [presentations, setPresentations] = useState<Presentation[]>([]);
	const [loading, setLoading] = useState(true);
	const [savingIndex, setSavingIndex] = useState<number | null>(null);
	const [globalError, setGlobalError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchPresentations() {
			try {
				setGlobalError(null);
				const res = await fetch(
					`/api/user/${userId}/bios/weekly-presentations`
				);
				if (!res.ok) throw new Error("Could not load previous presentations");
				const data = await res.json();
				setPresentations(data.data || []);
			} catch (err) {
				console.error("Fetch presentations failed", err);
				setGlobalError("Unable to load previous data. You can still add.");
			} finally {
				setLoading(false);
			}
		}
		fetchPresentations();
	}, [userId]);

	const handleChange = (
		index: number,
		field: "title" | "descriptions",
		value: string
	) => {
		setPresentations((prev) =>
			prev.map((item, i) =>
				i === index
					? { ...item, [field]: value, error: undefined, success: false }
					: item
			)
		);
	};

	const handleSave = async (index: number) => {
		const form = presentations[index];
		if (!form || !form.title?.trim() || !form.descriptions?.trim()) {
			setPresentations((prev) =>
				prev.map((item, i) =>
					i === index
						? { ...item, error: "Title and Description are required." }
						: item
				)
			);
			return;
		}

		setSavingIndex(index);
		const isUpdating = !!form.id;

		try {
			const res = await fetch(`/api/user/${userId}/bios/weekly-presentations`, {
				method: isUpdating ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(
					isUpdating
						? {
								presentationId: form.id,
								title: form.title.trim(),
								descriptions: form.descriptions.trim(),
							}
						: {
								title: form.title.trim(),
								descriptions: form.descriptions.trim(),
							}
				),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || "Save failed");
			}

			const responseData = await res.json();
			const updatedId = responseData.data?.id;

			setPresentations((prev) =>
				prev.map((item, i) =>
					i === index
						? {
								...item,
								id: updatedId || item.id,
								success: true,
								error: undefined,
							}
						: item
				)
			);

			toast.success(
				`Presentation ${isUpdating ? "updated" : "saved"} successfully!`
			);
		} catch (error) {
			const msg =
				typeof error === "object" && error !== null && "message" in error
					? (error as { message: string }).message
					: "An error occurred";
			setPresentations((prev) =>
				prev.map((item, i) => (i === index ? { ...item, error: msg } : item))
			);
			toast.error(msg);
		} finally {
			setSavingIndex(null);
		}
	};

	const addNewPresentation = () => {
		if (presentations.length >= 2) return;
		setPresentations((prev) => [...prev, { title: "", descriptions: "" }]);
	};

	if (loading) return <div className="p-6 text-center">Loading...</div>;

	return (
		<div className="min-h-screen flex justify-center p-4 md:p-6">
			<ToastContainer position="top-center" autoClose={3000} />
			<div className="w-full max-w-4xl space-y-8">
				{globalError && (
					<div className="bg-yellow-100 text-yellow-800 border border-yellow-400 p-4 rounded text-center">
						{globalError}
					</div>
				)}

				{presentations.length === 0 && !globalError && (
					<p className="text-center text-gray-600 py-6">
						No presentations found. Add one below.
					</p>
				)}

				{presentations.map((presentation, index) => (
					<div
						key={presentation.id ?? index}
						className="bg-slate-100 p-6 rounded-lg shadow border space-y-4">
						<h3 className="text-lg font-bold">
							Presentation {index + 1}
							{index === 0 && <span className="text-red-500"> *</span>}
						</h3>

						<input
							type="text"
							placeholder="Title"
							value={presentation.title}
							onChange={(e) => handleChange(index, "title", e.target.value)}
							disabled={savingIndex !== null}
							className="w-full bg-white border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
						/>

						<textarea
							placeholder="Description"
							value={presentation.descriptions}
							onChange={(e) =>
								handleChange(index, "descriptions", e.target.value)
							}
							rows={4}
							disabled={savingIndex !== null}
							className="w-full  bg-white border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
						/>

						{presentation.error && (
							<p className="text-red-600 text-sm">{presentation.error}</p>
						)}

						<div className="text-right">
							<button
								onClick={() => handleSave(index)}
								disabled={savingIndex === index}
								className="bg-red-600 text-white px-5 py-2 rounded hover:opacity-90 disabled:opacity-50">
								{savingIndex === index
									? "Saving..."
									: presentation.id
										? "Update"
										: "Save"}
							</button>
						</div>
					</div>
				))}

				<div className="text-center pt-4">
					<button
						onClick={addNewPresentation}
						disabled={savingIndex !== null || presentations.length >= 2}
						className={`text-black border border-black px-4 py-2 rounded transition font-semibold ${
							presentations.length >= 2
								? "opacity-50 cursor-not-allowed"
								: "hover:bg-black hover:text-white"
						}`}>
						➕ Add Presentation
					</button>
				</div>
			</div>
		</div>
	);
}
