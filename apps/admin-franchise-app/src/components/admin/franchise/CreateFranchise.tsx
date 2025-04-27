"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FranchiseType } from "@repo/db/client";

interface CountryType {
	id: string;
	name: string;
	code: string;
}

export default function CreateFranchise() {
	const router = useRouter();
	const [countries, setCountries] = useState<CountryType[]>([]);
	const [form, setForm] = useState({
		businessName: "",
		renewalPeriod: 1,
		franchiseType: FranchiseType.MASTER_FRANCHISE, // adjust options accordingly
		countryId: "",
		zoneId: "",
		regionId: "",
		franchiseAdminId: "",
	});
	useEffect(() => {
		getCountries();
	}, []);
	const getCountries = async () => {
		try {
			const res = await fetch("/api/admin/countries");
			const result = await res.json();
			if (result.message == "success") setCountries(result.countries);
			else toast.error(result.message);
		} catch (e) {
			if (e instanceof Error) {
				toast.error(`${e.message}`);
			}
			toast.error("Failed to fetching countries");
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const res = await fetch("/api/admin/franchise", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			if (!res.ok) throw new Error("Failed to create franchise");

			toast.success("Franchise created successfully!");
			router.refresh();
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong!");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6 bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
			<h2 className="text-2xl font-semibold text-center text-gray-800">
				Create Franchise
			</h2>

			<div className="space-y-4">
				<div>
					<label
						htmlFor="businessName"
						className="block text-sm font-medium text-gray-600">
						Business Name
					</label>
					<input
						id="businessName"
						name="businessName"
						onChange={handleChange}
						placeholder="Business Name"
						className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-200"
					/>
				</div>

				<div>
					<label
						htmlFor="franchiseType"
						className="block text-sm font-medium text-gray-600">
						Franchise Type
					</label>
					<select
						id="franchiseType"
						name="franchiseType"
						onChange={handleChange}
						className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-200">
						<option value={FranchiseType.MASTER_FRANCHISE}>
							MASTER FRANCHISE
						</option>
						<option value={FranchiseType.SUPER_FRANCHISE}>
							SUPER FRANCHISE
						</option>
						<option value={FranchiseType.REGIONAL_FRANCHISE}>
							REGIONAL FRANCHISE
						</option>
					</select>
				</div>

				<div>
					<label
						htmlFor="countryId"
						className="block text-sm font-medium text-gray-600">
						Select Country
					</label>
					<select
						id="countryId"
						name="countryId"
						onChange={handleChange}
						className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-200">
						{countries.length > 0 ? (
							countries.map((country) => (
								<option key={country.id} value={country.id}>
									{country.name}
								</option>
							))
						) : (
							<option value="">No countries available</option>
						)}
					</select>
				</div>

				{/* <div>
      <label htmlFor="zoneId" className="block text-sm font-medium text-gray-600">Zone ID</label>
      <input
        id="zoneId"
        name="zoneId"
        onChange={handleChange}
        placeholder="Zone ID"
        className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-200"
      />
    </div> */}

				{/* <div>
      <label htmlFor="regionId" className="block text-sm font-medium text-gray-600">Region ID</label>
      <input
        id="regionId"
        name="regionId"
        onChange={handleChange}
        placeholder="Region ID"
        className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-200"
      />
    </div> */}
			</div>

			<button
				type="submit"
				className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition duration-200">
				Create Franchise
			</button>
		</form>
	);
}
