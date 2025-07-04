"use client";

import { useEffect, useState } from "react";
import LoadingAnimation from "../LoadingAnimation";
import { Referral, UserMembershipType } from "@repo/db/client";
import { useSession } from "next-auth/react";
import ReferralDetailsDialog from "./ReferralDetailsDialog";

interface CreatorType {
	id: string;
	firstname: string;
	lastname: string;
	profileImage: string;
}

export type ReferralType = Omit<Referral, "creator"> & {
	creator: CreatorType;
};

export default function GetReferrals() {
	const { data: session, status } = useSession();
	const [referrals, setReferrals] = useState<ReferralType[]>([]);
	const [loading, setLoading] = useState(true);
	// const [actionLoading, setActionLoading] = useState(true);

	const membershipEndpoints: Record<UserMembershipType, string> = {
		FREE: "free",
		GOLD: "gold",
		VIP: "vip",
	};

	useEffect(() => {
		if (status !== "authenticated") return;
		const membershipType = session.user.membershipType as UserMembershipType;

		const endpoint = membershipEndpoints[membershipType] || "no-membership";
		const fetchReferrals = async () => {
			try {
				const res = await fetch(`/api/${endpoint}/referral`, {
					cache: "no-store",
				});

				if (!res.ok) throw new Error("Failed to fetch referrals");

				const { data } = await res.json();
				setReferrals(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchReferrals();
	}, [session, status]);

	// const TakeAction = async (action: "ACCEPTED" | "REJECTED", id: string) => {
	// 	if (status !== "authenticated") return;
	// 	const membershipType = session.user.membershipType as UserMembershipType;

	// 	const endpoint = membershipEndpoints[membershipType] || "no-membership";
	// 	const res = await fetch(`/api/${endpoint}/referral/${id}/action`, {
	// 		method: "POST",
	// 		body: JSON.stringify({
	// 			action: action,
	// 		}),
	// 	});
	// 	if (!res.ok) {
	// 		toast.error("Failed to take action");
	// 		throw new Error("Failed to take action");
	// 	}
	// };

	if (loading || status === "loading") return <LoadingAnimation />;

	return (
		<div className="overflow-x-auto w-full max-w-5xl mx-auto p-6 ">
			<h2 className="text-2xl font-bold text-gray-800 mb-6">Your Referrals</h2>

			<table className="min-w-full text-sm border border-gray-200">
				<thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
					<tr>
						<th className="px-4 py-3 text-left border-b">From</th>
						<th className="px-4 py-3 text-left border-b">Type</th>
						<th className="px-4 py-3 text-left border-b">Phone</th>
						<th className="px-4 py-3 text-left border-b">Status</th>
						<th className="px-4 py-2 text-left border-b">Action</th>
					</tr>
				</thead>
				<tbody>
					{referrals.length > 0 ? (
						referrals.map((referral) => (
							<tr
								key={referral.id}
								className="hover:bg-gray-50 transition duration-150">
								<td className="px-4 py-3 border-b">
									{referral.creator.firstname}
								</td>
								<td className="px-4 py-3 border-b">
									{referral.type.toLowerCase()}
								</td>
								<td className="px-4 py-3 border-b">{referral.phone}</td>
								<td className="px-4 py-3 border-b">{referral.status}</td>
								<td className="px-4 py-3 border-b">
									<ReferralDetailsDialog
										referral={referral}
										trigger={
											<span className="text-blue-600 underline cursor-pointer">
												View
											</span>
										}
									/>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={5} className="text-center px-4 py-6 text-gray-500">
								No referrals found.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
