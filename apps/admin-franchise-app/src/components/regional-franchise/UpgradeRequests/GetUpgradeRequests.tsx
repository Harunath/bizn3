"use client";

import React, { useEffect, useState } from "react";
import { User } from "@repo/db/client";
import Link from "next/link";

interface UpgradeRequest {
	id: string;
	user: User;
	requestedTier: string;
	status: string;
	createdAt: string;
}

export default function UpgradeRequests() {
	const [data, setData] = useState<UpgradeRequest[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const res = await fetch(`/api/regional-franchise/upgrade-requests`);
				const json = await res.json();

				if (!res.ok) throw new Error(json.error || "Failed to fetch");

				setData(json.data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "An unknown error occurred"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchRequests();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[200px]">
				<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
				<span className="ml-3 text-blue-600 font-semibold">
					Loading requests...
				</span>
			</div>
		);
	}

	if (error) {
		return <div className="text-red-500 font-medium">Error: {error}</div>;
	}

	if (!data || data.length === 0) {
		return <div className="text-gray-600">No upgrade requests found.</div>;
	}

	return (
		<div className="p-4">
			<Link href={"/regional-franchise/upgrade-requests"}>
				<h2 className="text-xl font-bold mb-4">Upgrade Requests</h2>
				<div className="overflow-x-auto">
					<table className="bg-white border border-gray-200 rounded-md">
						<thead className="w-fit bg-gray-100 text-gray-700">
							<tr>
								<th className="text-left py-2 px-4 border-b">User</th>
								<th className="text-left py-2 px-4 border-b">Tier</th>
								<th className="text-left py-2 px-4 border-b">Status</th>
								<th className="text-left py-2 px-4 border-b">Created At</th>
							</tr>
						</thead>
						<tbody>
							{data.map((req) => (
								<tr key={req.id} className="hover:bg-gray-50">
									<td className="py-2 px-4 border-b">
										{req.user?.firstname + " " + req.user?.lastname || "N/A"}
									</td>
									<td className="py-2 px-4 border-b">{req.requestedTier}</td>
									<td className="py-2 px-4 border-b">{req.status}</td>
									<td className="py-2 px-4 border-b">
										{new Date(req.createdAt).toLocaleDateString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Link>
		</div>
	);
}
