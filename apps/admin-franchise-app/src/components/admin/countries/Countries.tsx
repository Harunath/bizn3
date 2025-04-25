"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CountryType {
	id: string;
	name: string;
	code: string;
	adminId: string;
	createdAt: Date;
}

const Countries = () => {
	const [countries, setCountries] = useState<CountryType[]>([]);
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
	return (
		<div>
			<div className="rounded-2xl border">
				<h3 className="mb-3">
					<p className="text-3xl">Country List</p>
					<p className="text-xl">List of countries fetched from the server</p>
				</h3>
				<div className="">
					<ul className="space-y-2">
						{countries.length > 0 ? (
							countries.map((country) => (
								<li
									key={country.id}
									className="p-2 border-b border-gray-200 last:border-0">
									<div className="font-semibold">{country.name}</div>
									<div className="text-sm text-gray-500">
										Code: {country.code}
									</div>
									<div className="text-xs text-gray-500">
										Admin ID: {country.adminId}
									</div>
									<div className="text-xs text-gray-500">
										Created At: {country.createdAt.toLocaleString()}
									</div>
								</li>
							))
						) : (
							<p>No countries exist</p>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Countries;
