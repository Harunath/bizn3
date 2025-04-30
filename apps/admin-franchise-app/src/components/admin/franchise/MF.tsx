"use client";
// pages/franchises.tsx (or wherever you want)

import { Franchise } from "@prisma/client";
import { useEffect, useState } from "react";

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

const MF = () => {
	const [mF, setMF] = useState<FranchiseWithRelations[] | null>();
	useEffect(() => {
		getSF();
	}, []);
	const getSF = async () => {
		try {
			const res = await fetch("/api/admin/franchise", {});

			const result = await res.json();

			if (result.message === "success" && result.franchises) {
				setMF(result.franchises);
			}
		} catch (error) {
			console.error("[FETCH_FRANCHISES]", error);
		}
	};

	return (
		<div>
			{mF && mF.length > 0 ? (
				<div className="grid lg:grid-cols-2 gap-4">
					{mF.map((franchise) => (
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
				<div>No franchises found.</div>
			)}
		</div>
	);
};

export default MF;
