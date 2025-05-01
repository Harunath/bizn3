"use client";
// pages/franchises.tsx (or wherever you want)

import { Franchise } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiArrowFromLeft } from "react-icons/bi";

interface FranchiseWithRelations extends Franchise {
	country: {
		id: string;
		name: string;
		code: string;
	} | null; // ← Important: it can be null if no country

	franchiseAdmin: {
		id: string;
		firstName: string;
		lastName: string;
	} | null; // ← Important: it can be null if no admin
}

const SF = () => {
	const [sF, setSF] = useState<FranchiseWithRelations[] | null>();
	useEffect(() => {
		getSF();
	}, []);
	const getSF = async () => {
		try {
			const res = await fetch("/api/master-franchise/super-franchise", {
				next: { revalidate: 60 }, // ← Important: revalidate every 60 seconds
			});

			const result = await res.json();

			if (result.message === "success" && result.franchises) {
				setSF(result.franchises);
			}
		} catch (error) {
			console.error("[FETCH_FRANCHISES]", error);
		}
	};

	return (
		<div>
			<div className="flex items-center gap-x-4 p-4 mb-6 border-b border-gray-200">
				<BiArrowFromLeft className="text-lg text-gray-600" />
				<Link
					className="text-blue-500 hover:text-blue-700 transition duration-300"
					href="/master-franchise/super-franchise/register-super-franchise">
					Register SF
				</Link>
				<Link
					className="text-blue-500 hover:text-blue-700 transition duration-300"
					href="/master-franchise/super-franchise/register-super-franchise-admin">
					Register SF Admin
				</Link>
			</div>
			{sF && sF.length > 0 ? (
				<div className="grid lg:grid-cols-2 gap-4">
					{sF.map((franchise) => (
						<div key={franchise.id}>
							<p>{franchise.businessName}</p>
							{franchise.franchiseAdmin && (
								<p>
									{franchise.franchiseAdmin.firstName +
										" " +
										franchise.franchiseAdmin.lastName}
								</p>
							)}
							{franchise?.country && <p>{franchise?.country?.name}</p>}
							{franchise.address && <p>{franchise.address.toLocaleString()}</p>}
						</div>
					))}
				</div>
			) : (
				<div>No SF found.</div>
			)}
		</div>
	);
};

export default SF;
