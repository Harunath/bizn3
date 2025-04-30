// pages/franchises.tsx (or wherever you want)

import Link from "next/link";
import { BiArrowFromLeft } from "react-icons/bi";
import MF from "../../../../components/admin/franchise/MF";

const page = () => {
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
			<MF />
		</div>
	);
};

export default page;

export const revalidate = 60;
