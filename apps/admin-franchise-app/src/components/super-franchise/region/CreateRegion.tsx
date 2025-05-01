"use client";
import { useState } from "react";
import { toast } from "react-toastify";

const CreateRegion = () => {
	const [name, setName] = useState("");
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		// Basic client-side validation
		if (!name.trim() || !code.trim()) {
			setError("Please fill in all fields.");
			toast.error(error);
			setLoading(false);
			return;
		}

		try {
			const res = await fetch("/api/super-franchise/regions/create", {
				method: "POST",
				body: JSON.stringify({ name, code }),
			});
			const result = await res.json();
			if (result.message == "success") {
				const newRegion = result.country;
				toast.success(`Region "${newRegion.name}" created successfully!`);
				setName("");
				setCode("");
			}
		} catch (err) {
			if (err instanceof Error) {
				toast.error(err.message || "Failed to create Region.");
				setError(err.message || "Failed to create Region.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100  px-4">
			<div className="max-w-lg w-full p-6 my-6 bg-white  shadow-md">
				<div className="mb-6 text-center ">
					<h3 className="text-3xl font-bold text-gray-900">Create Region</h3>
					<p className="text-lg text-gray-600">Add a new Region to the list</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700">
							Region Name
						</label>
						<input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g., region-a"
							required
							disabled={loading}
							className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 disabled:opacity-50"
						/>
					</div>

					<div>
						<label
							htmlFor="code"
							className="block text-sm font-medium text-gray-700">
							Region Code
						</label>
						<input
							id="code"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							placeholder="e.g., R1, R2, R3"
							required
							disabled={loading}
							className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 disabled:opacity-50"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300">
						{loading ? "Creating..." : "Create Region"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateRegion;
