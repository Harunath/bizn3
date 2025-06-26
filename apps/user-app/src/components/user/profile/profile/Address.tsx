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

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const apiBase = `/api/user/${userId}/my-profile/address`;

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

			setMessage(
				exist ? "Address updated successfully." : "Address saved successfully."
			);
			toast.success(
				exist ? "Address updated successfully." : "Address saved successfully."
			);
		} catch (error) {
			setMessage(
				error instanceof Error ? error.message : "Something went wrong"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-5xl bg-white p-8 shadow space-y-8">
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

					<div className="grid grid-cols-2 gap-6">
						<InputField label="City" value={city} setValue={setCity} />
						<InputField
							label="State"
							value={state}
							setValue={setState}
							required
						/>
					</div>
					<div className="grid grid-cols-2 gap-6">
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
						{loading ? "saving..." : "Update"}
					</button>
				</div>

				{/* Feedback */}
				{message && (
					<p
						className={`mt-4 font-semibold ${
							message.includes("success") ? "text-green-700" : "text-red-700"
						}`}>
						{message}
					</p>
				)}

				{/* {updatedFields.length > 0 && (
					<div className="mt-4 text-sm text-gray-600">
						Updated fields:{" "}
						<span className="font-semibold">{updatedFields.join(", ")}</span>
					</div>
				)} */}
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
			<label className="block font-semibold mb-1">{label}</label>
			<input
				type="text"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className="w-full border border-black rounded px-4 py-2 focus:ring-2 focus:ring-red-600"
				required={required}
			/>
		</div>
	);
}
