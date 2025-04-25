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
		<form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4">
			<h2 className="text-xl font-semibold">Create Franchise</h2>
			<input
				name="businessName"
				onChange={handleChange}
				placeholder="Business Name"
				className="input"
			/>
			<select name="franchiseType" onChange={handleChange} className="input">
				<option value={FranchiseType.MASTER_FRANCHISE}>MASTER FRANCHISE</option>
				<option value={FranchiseType.SUPER_FRANCHISE}>SUPER FRANCHISE</option>
				<option value={FranchiseType.REGIONAL_FRANCHISE}>
					REGIONAL FRANCHISE
				</option>
			</select>
			<select name="franchiseType" onChange={handleChange} className="input">
				{countries.length > 0 ? (
					countries.map((country) => (
						<option key={country.id} value={country.id}>
							{country.name}
						</option>
					))
				) : (
					<option value="">No countries exist</option>
				)}
			</select>
			{/* <input
				name="countryId"
				onChange={handleChange}
				placeholder="Country ID"
				className="input"
			/>
			<input
				name="zoneId"
				onChange={handleChange}
				placeholder="Zone ID"
				className="input"
			/>
			<input
				name="regionId"
				onChange={handleChange}
				placeholder="Region ID"
				className="input"
			/> */}
			<button type="submit" className="btn btn-primary w-full">
				Create Franchise
			</button>
		</form>
	);
}
