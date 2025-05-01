"use client";
import React, { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from "react-toastify";

interface RegionType {
	id: string;
	name: string;
	code: string;
	adminId: string;
	createdAt: Date;
}

const Regions = () => {
	const [regions, setRegions] = useState<RegionType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	useEffect(() => {
		getRegions();
	}, []);
	const getRegions = async () => {
		try {
			const res = await fetch("/api/super-franchise/regions");
			const result = await res.json();
			if (result.message == "success") setRegions(result.regions);
			else toast.error(result.message);
		} catch (e) {
			if (e instanceof Error) {
				toast.error(`${e.message}`);
			}
			toast.error("Failed to fetching regions");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex justify-center min-h-screen px-4 py-8">
			<div className="w-full max-w-3xl p-6 bg-gray-100 shadow-xl border border-red-600">
				<h3 className="mb-4 border-b-1">
					<p className="text-3xl font-semibold text-gray-900">Region List</p>
					<p className="text-xl text-gray-500">
						List of regions fetched from the server
					</p>
				</h3>
				<div>
					{isLoading ? (
						<div className="flex justify-center items-center space-x-2">
							<BiLoaderAlt className="animate-spin text-red-600 text-4xl" />
							<p className="text-lg text-gray-600">Loading...</p>
						</div>
					) : regions.length > 0 ? (
						<ul className="space-y-4 max-h-96 overflow-y-auto">
							{regions.map((region) => (
								<li
									key={region.id}
									className="p-4 border-b border-gray-200 last:border-0 hover:bg-gray-100 transition duration-300 ease-in-out rounded-lg">
									<div className="font-semibold text-gray-900">
										{region.name}
									</div>
									<div className="text-sm text-gray-700">
										Code: {region.code}
									</div>
									<div className="text-xs text-gray-600">
										Admin ID: {region.adminId}
									</div>
									<div className="text-xs text-gray-500">
										Created At: {new Date(region.createdAt).toLocaleString()}
									</div>
								</li>
							))}
						</ul>
					) : (
						<p className="text-gray-600">No regions exist</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Regions;
