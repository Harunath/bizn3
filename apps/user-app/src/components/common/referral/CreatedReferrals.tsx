"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
	Referral,
	ReferralStatus,
	Testimonials,
	UserMembershipType,
} from "@repo/db/client";
import { IoMdArrowDropdown } from "react-icons/io";

interface UserType {
	id: string;
	firstname: string;
	lastname: string;
	profileImage: string;
}

export type ReferralType = Omit<Referral, "creator" | "receiver"> & {
	creator: UserType;
	receiver: UserType;
	testimonials: Testimonials;
};

const statusOptions: ReferralStatus[] = [
	"ACCEPTED",
	"REJECTED",
	"IN_PROGRESS",
	"WAITING",
	"COMPLETED",
];

export default function CreatedReferrals() {
	const { data: session, status } = useSession();
	const [referrals, setReferrals] = useState<ReferralType[]>([]);
	const [loading, setLoading] = useState(true);
	const [totalPages, setTotalPages] = useState(1);

	const membershipEndpoints: Record<UserMembershipType, string> = {
		FREE: "free",
		GOLD: "gold",
		VIP: "vip",
	};

	const userMembershipType = session?.user
		?.membershipType as UserMembershipType;
	const endpoint = membershipEndpoints[userMembershipType] || "no-membership";

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const selectedStatuses = searchParams.getAll("status");
	const page = parseInt(searchParams.get("page") || "1");

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const [localStatusSelections, setLocalStatusSelections] = useState<
		ReferralStatus[]
	>(searchParams.getAll("status") as ReferralStatus[]);

	useEffect(() => {
		setLocalStatusSelections(searchParams.getAll("status") as ReferralStatus[]);
	}, [searchParams]);

	const handleStatusToggle = (status: ReferralStatus) => {
		setLocalStatusSelections((prev) =>
			prev.includes(status)
				? prev.filter((s) => s !== status)
				: [...prev, status]
		);
	};

	const applyFilters = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("status");
		localStatusSelections.forEach((s) => params.append("status", s));
		params.set("page", "1");
		router.replace(`${pathname}?${params.toString()}`);
		setDropdownOpen(false);
	};

	const resetFilters = () => {
		setLocalStatusSelections([]);
		const params = new URLSearchParams(searchParams.toString());
		params.delete("status");
		params.set("page", "1");
		router.replace(`${pathname}?${params.toString()}`);
		setDropdownOpen(false);
	};

	const updateQueryParam = (key: string, value: string | null) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value === null) {
			params.delete(key);
		} else {
			params.set(key, value);
		}
		router.replace(`${pathname}?${params.toString()}`);
	};

	const changePage = (newPage: number) => {
		updateQueryParam("page", newPage.toString());
	};

	useEffect(() => {
		if (status !== "authenticated") return;

		const queryParams = new URLSearchParams();
		selectedStatuses.forEach((s) => queryParams.append("status", s));
		queryParams.set("page", page.toString());
		queryParams.set("limit", "10");

		const fetchReferrals = async () => {
			setLoading(true);
			try {
				const res = await fetch(
					`/api/${endpoint}/referral/created-referrals?${queryParams.toString()}`,
					{ cache: "no-store" }
				);
				if (!res.ok) throw new Error("Failed to fetch referrals");

				const { data, pagination } = await res.json();
				setReferrals(data);
				setTotalPages(pagination?.totalPages || 1);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchReferrals();
	}, [session, status, selectedStatuses.join(","), page]);

	return (
		<div className="w-full max-w-5xl mx-auto p-6">
			<h2 className="text-2xl font-bold text-gray-800 mb-4">
				Referrals You Created
			</h2>

			{/* Filter Dropdown */}
			<div className="relative inline-block mb-4" ref={dropdownRef}>
				<button
					onClick={() => setDropdownOpen((prev) => !prev)}
					className="flex items-center gap-2 px-4 py-2 text-sm bg-white border rounded-md shadow-sm hover:bg-gray-50">
					Filter by Status
					<IoMdArrowDropdown className="w-4 h-4" />
				</button>

				{dropdownOpen && (
					<div className="absolute left-0 z-10 w-64 mt-2 bg-white border rounded-md shadow-lg">
						<div className="max-h-64 overflow-y-auto p-2">
							{statusOptions.map((s) => (
								<div
									key={s}
									className="flex items-center px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
									onClick={() => handleStatusToggle(s)}>
									<input
										type="checkbox"
										checked={localStatusSelections.includes(s)}
										readOnly
										className="mr-2 accent-blue-600"
									/>
									<span className="text-sm text-gray-700">{s}</span>
								</div>
							))}
						</div>
						<div className="flex justify-between p-2 border-t bg-gray-50">
							<button
								onClick={resetFilters}
								className="px-3 py-1 text-sm text-gray-600 hover:text-red-500">
								Reset
							</button>
							<button
								onClick={applyFilters}
								className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
								Apply
							</button>
						</div>
					</div>
				)}
			</div>

			{loading || status === "loading" ? (
				<div className="flex justify-center items-center min-w-full">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
				</div>
			) : (
				<>
					{/* Table */}
					<div className="overflow-x-auto border border-gray-200 rounded">
						<table className="min-w-full text-sm">
							<thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
								<tr>
									<th className="px-4 py-3 text-left border-b">To</th>
									<th className="px-4 py-3 text-left border-b">Type</th>
									<th className="px-4 py-3 text-left border-b">Phone</th>
									<th className="px-4 py-3 text-left border-b">Status</th>
									{/* <th className="px-4 py-3 text-left border-b">Action</th> */}
								</tr>
							</thead>
							<tbody>
								{referrals.length > 0 ? (
									referrals.map((referral) => (
										<tr
											key={referral.id}
											className="hover:bg-gray-50 transition duration-150">
											<td className="px-4 py-3 border-b">
												{referral.receiver.firstname}
											</td>
											<td className="px-4 py-3 border-b">
												{referral.type.toLowerCase()}
											</td>
											<td className="px-4 py-3 border-b">{referral.phone}</td>
											<td className="px-4 py-3 border-b">{referral.status}</td>
											{/* <td className="px-4 py-3 border-b">
												(
													<span
														className={`font-medium ${
															referral.status === "ACCEPTED"
																? "text-green-600"
																: referral.status === "REJECTED"
																	? "text-yellow-600"
																	: referral.status === "IN_PROGRESS"
																		? "text-blue-600"
																		: "text-gray-500"
														}`}>
														{referral.status.charAt(0).toUpperCase() +
															referral.status.slice(1).toLowerCase()}
													</span>
												)
											</td> */}
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={5}
											className="text-center px-4 py-6 text-gray-500">
											No referrals found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex justify-center mt-6 gap-2">
							{Array.from({ length: totalPages }).map((_, i) => {
								const pageNumber = i + 1;
								return (
									<button
										key={pageNumber}
										onClick={() => changePage(pageNumber)}
										className={`px-3 py-1 border rounded ${
											pageNumber === page
												? "bg-blue-600 text-white"
												: "bg-white text-gray-700 border-gray-300"
										}`}>
										{pageNumber}
									</button>
								);
							})}
						</div>
					)}
				</>
			)}
		</div>
	);
}
