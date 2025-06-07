"use client";

import { useState } from "react";

type AddressType = {
	addressLane1: string;
	addressLane2?: string;
	city?: string;
	state: string;
	country: string;
	pincode?: string;
};

interface AddressProps {
	userId: string;
}

export default function Address({ userId }: AddressProps) {
	const [address, setAddress] = useState<AddressType>({
		addressLane1: "Hyderabad",
		addressLane2: "",
		city: "",
		state: "Telangana",
		country: "IN",
		pincode: "",
	});

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleChange = (key: keyof AddressType, value: string) => {
		setAddress((prev) => ({ ...prev, [key]: value }));
	};

	const apiBase = `/api/user/${userId}/my-profile/address`;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		try {
			const res = await fetch(apiBase, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(address),
			});

			if (!res.ok) throw new Error("Failed to save address");

			setMessage("Address saved successfully.");
		} catch (error) {
			if (error instanceof Error) {
				setMessage(error.message);
			} else {
				setMessage("Something went wrong");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleUpdate = async () => {
		setLoading(true);
		setMessage("");
		try {
			const res = await fetch(apiBase, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(address),
			});

			if (!res.ok) throw new Error("Failed to update address");

			setMessage("Address updated successfully.");
		} catch (error) {
			if( error instanceof Error) {
				setMessage(error.message);
			}
			setMessage("Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-5xl bg-white p-8 rounded-lg shadow space-y-8">
				{/* Address Section */}
				<div className="space-y-4">
					<h2 className="text-xl font-bold text-black">Address</h2>

					<div>
						<label className="block font-semibold mb-1">Address Lane 1</label>
						<input
							type="text"
							value={address.addressLane1}
							onChange={(e) => handleChange("addressLane1", e.target.value)}
							className="w-full border border-black rounded px-4 py-2 focus:ring-2 focus:ring-red-600"
							required
						/>
					</div>

					<div>
						<label className="block font-semibold mb-1">Address Lane 2</label>
						<input
							type="text"
							value={address.addressLane2 || ""}
							onChange={(e) => handleChange("addressLane2", e.target.value)}
							className="w-full border border-black rounded px-4 py-2 focus:ring-2 focus:ring-red-600"
						/>
					</div>

					<div className="grid grid-cols-2 gap-6">
						<div>
							<label className="block font-semibold mb-1">City</label>
							<input
								type="text"
								value={address.city || ""}
								onChange={(e) => handleChange("city", e.target.value)}
								className="w-full border border-black rounded px-4 py-2 focus:ring-2 focus:ring-red-600"
							/>
						</div>
						<div>
							<label className="block font-semibold mb-1">State</label>
							<input
								type="text"
								value={address.state}
								onChange={(e) => handleChange("state", e.target.value)}
								className="w-full border border-black rounded px-4 py-2 focus:ring-2 focus:ring-red-600"
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-6">
						<div>
							<label className="block font-semibold mb-1">Country</label>
							<input
								type="text"
								value={address.country}
								onChange={(e) => handleChange("country", e.target.value)}
								className="w-full border border-black rounded px-4 py-2 focus:ring-2 focus:ring-red-600"
								required
							/>
						</div>
						<div>
							<label className="block font-semibold mb-1">PIN Code</label>
							<input
								type="text"
								value={address.pincode || ""}
								onChange={(e) => handleChange("pincode", e.target.value)}
								className="w-full border border-black rounded px-4 py-2 focus:ring-2 focus:ring-red-600"
							/>
						</div>
					</div>
				</div>

				{/* Submit Buttons */}
				<div className="flex justify-end gap-4 pt-6">
					<button
						type="button"
						disabled={loading}
						onClick={handleUpdate}
						className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-semibold disabled:opacity-50">
						{loading ? "Updating..." : "Update"}
					</button>
					<button
						type="submit"
						disabled={loading}
						className="bg-black text-white px-6 py-2 rounded hover:opacity-90 font-semibold disabled:opacity-50">
						{loading ? "Saving..." : "Save"}
					</button>
				</div>

				{message && (
					<p
						className={`mt-4 font-semibold ${
							message.includes("success") ? "text-green-700" : "text-red-700"
						}`}>
						{message}
					</p>
				)}
			</form>
		</div>
	);
}
