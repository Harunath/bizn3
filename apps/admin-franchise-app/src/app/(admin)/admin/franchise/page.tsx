// pages/franchises.tsx (or wherever you want)

import { Franchise } from "@prisma/client";
import Link from "next/link";
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

const page = async () => {
	let franchises: FranchiseWithRelations[] | null;
	try {
		const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/franchise`, {
			next: { revalidate: 60 }, // ← Important: revalidate every 60 seconds
		});

		const result = await res.json();

		if (result.message === "success" && result.franchises) {
			franchises = result.franchises;
		} else franchises = null;
	} catch (error) {
		console.error("[FETCH_FRANCHISES]", error);
		franchises = null;
	}
	return (
		<div>
			<div className="flex items-center gap-x-4 p-4 mb-6 border-b border-gray-200">
				<BiArrowFromLeft className="text-lg text-gray-600" />
				<Link
					className="text-blue-500 hover:text-blue-700 transition duration-300"
					href="/admin/franchise/register-franchise">
					Register Franchise
				</Link>
				<Link
					className="text-blue-500 hover:text-blue-700 transition duration-300"
					href="/admin/franchise/register-franchise-admin">
					Register Franchise Admin
				</Link>
			</div>
			{franchises && franchises.length > 0 ? (
				<div className="grid lg:grid-cols-2 gap-4">
					{franchises.map((franchise) => (
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

export default page;

export const revalidate = 60;
