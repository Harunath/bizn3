"use client";
import React, { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
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
	const [isLoading, setIsLoading] = useState<boolean>(true);
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
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex justify-center min-h-screen px-4 py-8">
			<div className="w-full max-w-3xl p-6 bg-gray-100 shadow-xl border border-red-600">
				<h3 className="mb-4 border-b-1">
					<p className="text-3xl font-semibold text-gray-900">Country List</p>
					<p className="text-xl text-gray-500">
						List of countries fetched from the server
					</p>
				</h3>
				<div>
					{isLoading ? (
						<div className="flex justify-center items-center space-x-2">
							<BiLoaderAlt className="animate-spin text-red-600 text-4xl" />
							<p className="text-lg text-gray-600">Loading...</p>
						</div>
					) : countries.length > 0 ? (
						<ul className="space-y-4 max-h-96 overflow-y-auto">
							{countries.map((country) => (
								<li
									key={country.id}
									className="p-4 border-b border-gray-200 last:border-0 hover:bg-gray-100 transition duration-300 ease-in-out rounded-lg">
									<div className="font-semibold text-gray-900">
										{country.name}
									</div>
									<div className="text-sm text-gray-700">
										Code: {country.code}
									</div>
									<div className="text-xs text-gray-600">
										Admin ID: {country.adminId}
									</div>
									<div className="text-xs text-gray-500">
										Created At: {new Date(country.createdAt).toLocaleString()}
									</div>
								</li>
							))}
						</ul>
					) : (
						<p className="text-gray-600">No countries exist</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Countries;
