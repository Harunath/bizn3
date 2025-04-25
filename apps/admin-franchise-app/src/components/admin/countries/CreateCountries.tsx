"use client";
import { useState } from "react";
import { toast } from "react-toastify";

const CreateCountry = () => {
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
			const res = await fetch("/api/admin/countries/create", {
				method: "POST",
				body: JSON.stringify({ name, code }),
			});
			const result = await res.json();
			if (result.message == "success") {
				const newCountry = result.country;
				toast.success(`Country "${newCountry.name}" created successfully!`);
				setName("");
				setCode("");
			}
		} catch (err) {
			if (err instanceof Error) {
				toast.error(err.message || "Failed to create country.");
				setError(err.message || "Failed to create country.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="rounded-2xl">
			<div className="mb-3">
				<h3 className="text-3xl">Create Country</h3>
				<p className="text-xl">Create a new country</p>
			</div>
			<div>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700">
							Name
						</label>
						<input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Country Name"
							required
							className="mt-1"
							disabled={loading}
						/>
					</div>
					<div>
						<label
							htmlFor="code"
							className="block text-sm font-medium text-gray-700">
							Code
						</label>
						<input
							id="code"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							placeholder="Country Code (e.g., US, CA, JP)"
							required
							className="mt-1"
							disabled={loading}
						/>
					</div>
					<button type="submit" disabled={loading} className="w-full">
						{loading ? "Creating..." : "Create Country"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateCountry;
