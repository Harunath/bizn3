"use client";

import { useEffect, useState } from "react";

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
				if (!res.ok) throw new Error("Failed to fetch presentations");
				const data = await res.json();
				setPresentations(data.data || []);
			} catch (err) {
				setGlobalError(
					typeof err === "object" && err !== null && "message" in err
						? (err as { message: string }).message
						: "Failed to load data"
				);
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
		if (!form) return;

		if (!form.title.trim() || !form.descriptions.trim()) {
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
		setPresentations((prev) =>
			prev.map((item, i) =>
				i === index ? { ...item, error: undefined, success: false } : item
			)
		);

		try {
			const res = await fetch(`/api/user/${userId}/bios/weekly-presentations`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: form.title.trim(),
					descriptions: form.descriptions.trim(),
				}),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || "Save failed");
			}

			setPresentations((prev) =>
				prev.map((item, i) => (i === index ? { ...item, success: true } : item))
			);

			setTimeout(() => {
				setPresentations((prev) =>
					prev.map((item, i) =>
						i === index ? { ...item, success: false } : item
					)
				);
			}, 3000);
		} catch (error) {
			setPresentations((prev) =>
				prev.map((item, i) =>
					i === index
						? {
								...item,
								error:
									error && typeof error === "object" && "message" in error
										? (error as { message: string }).message
										: "An error occurred",
						  }
						: item
				)
			);
		} finally {
			setSavingIndex(null);
		}
	};

	const addNewPresentation = () => {
		setPresentations((prev) => [...prev, { title: "", descriptions: "" }]);
	};

	if (loading) return <div className="p-6 text-center">Loading...</div>;

	return (
		<div className="min-h-screen bg-gray-100 flex justify-center p-6">
			<div className="w-full max-w-3xl space-y-8">
				{globalError && (
					<div className="bg-red-100 text-red-700 border border-red-400 p-4 rounded mb-4 text-center">
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
						className="bg-white p-6 rounded-lg shadow border space-y-4">
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
							className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
						/>

						<textarea
							placeholder="Description"
							value={presentation.descriptions}
							onChange={(e) =>
								handleChange(index, "descriptions", e.target.value)
							}
							rows={4}
							disabled={savingIndex !== null}
							className="w-full border border-black rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
						/>

						{presentation.error && (
							<p className="text-red-600 text-sm">{presentation.error}</p>
						)}
						{presentation.success && (
							<p className="text-green-600 text-sm">Saved successfully!</p>
						)}

						<div className="text-right">
							<button
								onClick={() => handleSave(index)}
								disabled={savingIndex === index}
								className="bg-black text-white px-5 py-2 rounded hover:opacity-90 disabled:opacity-50">
								{savingIndex === index ? "Saving..." : "Save"}
							</button>
						</div>
					</div>
				))}

				<div className="text-center pt-4">
					<button
						onClick={addNewPresentation}
						disabled={savingIndex !== null}
						className="text-black border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition font-semibold">
						➕ Add Presentation
					</button>
				</div>
			</div>
		</div>
	);
}
