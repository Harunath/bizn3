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
		<div className="overflow-x-auto bg-white rounded shadow p-4">
			<h2 className="text-xl font-bold mb-4">Referrals</h2>
			<table className="min-w-full border border-gray-200 text-sm">
				<thead className="bg-gray-100 text-gray-700">
					<tr>
						<th className="px-4 py-2 text-left">From</th>
						<th className="px-4 py-2 text-left">Type</th>
						<th className="px-4 py-2 text-left">Phone</th>
						<th className="px-4 py-2 text-left">Status</th>
					</tr>
				</thead>
				<tbody>
					{referrals.length > 0 ? (
						referrals.map((referral) => (
							<tr key={referral.id} className="border-t">
								<td className="px-4 py-2">
									{referral?.creator?.firstname || ""}{" "}
									{referral.creator?.lastname || ""}
								</td>
								<td className="px-4 py-2 capitalize">
									{referral.type.toLowerCase()}
								</td>
								<td className="px-4 py-2">
									{referral.phone ? referral.phone : "Not provided"}
								</td>
								<td className="px-4 py-2">{referral.status}</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={4} className="text-center px-4 py-6">
								No referrals found
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
