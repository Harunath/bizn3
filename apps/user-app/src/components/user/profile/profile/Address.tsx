"use client";

import { useEffect, useState } from "react";
import { Address } from "@repo/db/client";
import { toast } from "react-toastify";

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
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const apiBase = `/api/user/${userId}/my-profile/address`;

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
	}, [addressProp]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");

		const payload = {
			addressLane1,
			addressLane2,
			city,
			state,
			country,
			pincode,
		};

		try {
			const res = await fetch(apiBase, {
				method: exist ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const result = await res.json();

			if (!res.ok) {
				throw new Error(result.message || "Failed to save address");
			}

			const successMsg = exist
				? "Address updated successfully."
				: "Address saved successfully.";
			setMessage(successMsg);
			toast.success(successMsg);
		} catch (error) {
			const errMsg =
				error instanceof Error ? error.message : "Something went wrong";
			setMessage(errMsg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex justify-center items-start p-4 md:p-6">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-5xl bg-slate-100 p-6 md:p-8  shadow-xl space-y-8">
				<h2 className="text-xl font-bold text-black">Personal Address</h2>

				{/* Form Fields */}
				<div className="space-y-4">
					<InputField
						label="Address Lane 1"
						value={addressLane1}
						setValue={setAddressLane1}
						required
					/>
					<InputField
						label="Address Lane 2"
						value={addressLane2}
						setValue={setAddressLane2}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<InputField label="City" value={city} setValue={setCity} />
						<InputField
							label="State"
							value={state}
							setValue={setState}
							required
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<InputField
							label="Country"
							value={country}
							setValue={setCountry}
							required
						/>
						<InputField
							label="PIN Code"
							value={pincode}
							setValue={setPincode}
						/>
					</div>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end pt-6">
					<button
						type="submit"
						disabled={loading}
						className="bg-red-600 text-white px-6 py-2 rounded hover:opacity-90 font-semibold disabled:opacity-50">
						{loading ? "Saving..." : exist ? "Update" : "Save"}
					</button>
				</div>

				{/* Fallback Text Feedback */}
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

function InputField({
	label,
	value,
	setValue,
	required = false,
}: {
	label: string;
	value: string;
	setValue: (val: string) => void;
	required?: boolean;
}) {
	return (
		<div>
			<label className="block font-semibold mb-1 text-black">{label}</label>
			<input
				type="text"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				required={required}
				className="w-full bg-white border border-black rounded px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
			/>
		</div>
	);
}
