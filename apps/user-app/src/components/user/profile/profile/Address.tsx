"use client";

import { useEffect, useState } from "react";
import { Address } from "@repo/db/client";

interface AddressProps {
	userId: string;
	addressProp: Address;
}

export default function AddressComp({ userId, addressProp }: AddressProps) {
	const [addressLane1, setAddressLane1] = useState("");
	const [addressLane2, setAddressLane2] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [country, setCountry] = useState("");
	const [pincode, setPincode] = useState("");
	const [exist, setExist] = useState(false);

	useEffect(() => {
		if (addressProp) {
			setExist(true);
			setAddressLane1(addressProp.addressLane1 || "");
			setAddressLane2(addressProp.addressLane2 || "");
			setCity(addressProp.city || "");
			setState(addressProp.state || "");
			setCountry(addressProp.country || "");
			setPincode(addressProp.pincode || "");
		}
	}, []);

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const apiBase = `/api/user/${userId}/my-profile/address`;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		try {
			const res = await fetch(apiBase, {
				method: exist ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					addressLane1,
					addressLane2,
					city,
					state,
					country,
					pincode,
				}),
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
							value={addressLane1}
							onChange={(e) => setAddressLane1(e.target.value)}
							className="w-full border border-black rounded px-4 py-2 focus:ring-2 focus:ring-red-600"
							required
						/>
					</div>

					<div>
						<label className="block font-semibold mb-1">Address Lane 2</label>
						<input
							type="text"
							value={addressLane2 || ""}
							onChange={(e) => setAddressLane2(e.target.value)}
							className="w-full border border-black rounded px-4 py-2 focus:ring-2 focus:ring-red-600"
						/>
					</div>

					<div className="grid grid-cols-2 gap-6">
						<div>
							<label className="block font-semibold mb-1">City</label>
							<input
								type="text"
								value={city || ""}
								onChange={(e) => setCity(e.target.value)}
								className="w-full border border-black rounded px-4 py-2 focus:ring-2 focus:ring-red-600"
							/>
						</div>
						<div>
							<label className="block font-semibold mb-1">State</label>
							<input
								type="text"
								value={state}
								onChange={(e) => setState(e.target.value)}
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
								value={country}
								onChange={(e) => setCountry(e.target.value)}
								className="w-full border border-black rounded px-4 py-2 focus:ring-2 focus:ring-red-600"
								required
							/>
						</div>
						<div>
							<label className="block font-semibold mb-1">PIN Code</label>
							<input
								type="text"
								value={pincode || ""}
								onChange={(e) => setPincode(e.target.value)}
								className="w-full border border-black rounded px-4 py-2 focus:ring-2 focus:ring-red-600"
							/>
						</div>
					</div>
				</div>

				{/* Submit Buttons */}
				<div className="flex justify-end gap-4 pt-6">
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
