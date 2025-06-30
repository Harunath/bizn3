"use client";

import { useEffect, useState } from "react";
import LoadingAnimation from "../LoadingAnimation";
import { Referral, UserMembershipType } from "@repo/db/client";
import { useSession } from "next-auth/react";

interface CreatorType {
	id: string;
	firstname: string;
	lastname: string;
	profileImage: string;
}

type ReferralType = Omit<Referral, "creator"> & {
	creator: CreatorType;
};

export default function GetReferrals() {
	const { data: session, status } = useSession();
	const [referrals, setReferrals] = useState<ReferralType[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (status !== "authenticated") return;

		const fetchReferrals = async () => {
			try {
				const membershipType = session.user
					.membershipType as UserMembershipType;

				const membershipEndpoints: Record<UserMembershipType, string> = {
					FREE: "free",
					GOLD: "gold",
					VIP: "vip",
				};

				const endpoint = membershipEndpoints[membershipType] || "no-membership";

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
					</tr>
				</thead>
				<tbody>
					{referrals.length > 0 ? (
						referrals.map((referral) => (
							<tr
								key={referral.id}
								className="hover:bg-gray-50 transition duration-150">
								<td className="px-4 py-3 border-b">
									<span className="font-medium text-gray-800">
										{referral?.creator?.firstname || ""}{" "}
										{referral?.creator?.lastname || ""}
									</span>
								</td>
								<td className="px-4 py-3 border-b capitalize text-gray-600">
									{referral.type.toLowerCase()}
								</td>
								<td className="px-4 py-3 border-b text-gray-600">
									{referral.phone || "Not provided"}
								</td>
								<td className="px-4 py-3 border-b">
									<span
										className={`px-3 py-1 inline-block rounded-full text-xs font-semibold ${
											referral.status === "ACCEPTED"
												? "bg-green-100 text-green-700"
												: referral.status === "IN_PROGRESS" ||
													  referral.status === "WAITING"
													? "bg-yellow-100 text-yellow-700"
													: "bg-red-100 text-red-700"
										}`}>
										{referral.status}
									</span>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={4} className="text-center px-4 py-6 text-gray-500">
								No referrals found.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
