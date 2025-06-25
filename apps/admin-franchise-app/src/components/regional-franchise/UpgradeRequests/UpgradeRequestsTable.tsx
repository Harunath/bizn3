"use client";

import { useEffect, useState } from "react";
import {
	FaCheckCircle,
	FaTimesCircle,
	FaChevronLeft,
	FaChevronRight,
} from "react-icons/fa";

interface UpgradeRequest {
	id: string;
	user: {
		id: string;
		name: string;
		email: string;
		membershipType: string;
	};
	requestedTier: string;
	status: string;
	createdAt: string;
}

export default function UpgradeRequestsTable() {
	const [data, setData] = useState<UpgradeRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [limit] = useState(5);
	const [totalPages, setTotalPages] = useState(1);
	const [popup, setPopup] = useState<null | {
		id: string;
		action: "APPROVED" | "REJECTED";
		userName: string;
	}>(null);

	const fetchRequests = async () => {
		setLoading(true);
		try {
			const res = await fetch(
				`/api/regional-franchise/upgrade-requests?page=${page}&limit=${limit}`
			);
			const json = await res.json();
			setData(json.data || []);
			setTotalPages(json.meta?.totalPages || 1);
		} catch (err) {
			console.error(
				err instanceof Error ? err.message : "Failed to fetch requests"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleAction = async () => {
		if (!popup) return;

		const res = await fetch(
			`/api/regional-franchise/upgrade-requests/${popup.id}/review`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: popup.action }),
			}
		);

		if (res.ok) {
			fetchRequests(); // refresh data
		}

		setPopup(null); // close popup
	};

	useEffect(() => {
		fetchRequests();
	}, [page]);

	return (
		<div className="p-6 max-w-5xl mx-auto">
			<h2 className="text-2xl font-bold mb-4">Upgrade Requests</h2>

			{loading ? (
				<div className="text-blue-600">Loading...</div>
			) : data.length === 0 ? (
				<div className="text-gray-600">No requests found.</div>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
						<thead className="bg-gray-100">
							<tr>
								<th className="text-left px-4 py-2">User</th>
								<th className="text-left px-4 py-2">Email</th>
								<th className="text-left px-4 py-2">Requested Tier</th>
								<th className="text-left px-4 py-2">Status</th>
								<th className="text-left px-4 py-2">Date</th>
								<th className="text-left px-4 py-2">Actions</th>
							</tr>
						</thead>
						<tbody>
							{data.map((req) => (
								<tr key={req.id} className="hover:bg-gray-50">
									<td className="px-4 py-2">{req.user.name}</td>
									<td className="px-4 py-2">{req.user.email}</td>
									<td className="px-4 py-2">{req.requestedTier}</td>
									<td className="px-4 py-2">{req.status}</td>
									<td className="px-4 py-2">
										{new Date(req.createdAt).toLocaleDateString()}
									</td>
									<td className="px-4 py-2 flex gap-2">
										{req.status === "PENDING" && (
											<>
												<button
													className="text-green-600 hover:text-green-800"
													onClick={() =>
														setPopup({
															id: req.id,
															action: "APPROVED",
															userName: req.user.name,
														})
													}>
													<FaCheckCircle size={20} />
												</button>
												<button
													className="text-red-600 hover:text-red-800"
													onClick={() =>
														setPopup({
															id: req.id,
															action: "REJECTED",
															userName: req.user.name,
														})
													}>
													<FaTimesCircle size={20} />
												</button>
											</>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{/* Pagination */}
					<div className="flex items-center justify-between mt-4">
						<button
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							className="flex items-center px-3 py-1 text-sm border rounded hover:bg-gray-100"
							disabled={page === 1}>
							<FaChevronLeft className="mr-1" />
							Prev
						</button>
						<span className="text-sm">
							Page {page} of {totalPages}
						</span>
						<button
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							className="flex items-center px-3 py-1 text-sm border rounded hover:bg-gray-100"
							disabled={page === totalPages}>
							Next <FaChevronRight className="ml-1" />
						</button>
					</div>
				</div>
			)}

			{/* Custom Popup */}
			{popup && (
				<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
						<h3 className="text-lg font-semibold mb-4">
							Confirm {popup.action.toLowerCase()}?
						</h3>
						<p className="mb-4">
							Are you sure you want to{" "}
							<strong>{popup.action.toLowerCase()}</strong> the request of{" "}
							<strong>{popup.userName}</strong>?
						</p>
						<div className="flex justify-end gap-4">
							<button
								onClick={() => setPopup(null)}
								className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">
								Cancel
							</button>
							<button
								onClick={handleAction}
								className={`px-4 py-2 rounded text-white text-sm ${
									popup.action === "APPROVED"
										? "bg-green-600 hover:bg-green-700"
										: "bg-red-600 hover:bg-red-700"
								}`}>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
