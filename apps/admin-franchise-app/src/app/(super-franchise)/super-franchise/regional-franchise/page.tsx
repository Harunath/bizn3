// pages/franchises.tsx (or wherever you want)

import Link from "next/link";
import { BiArrowFromLeft } from "react-icons/bi";
import RF from "../../../../components/super-franchise/regional-franchise/RF";

const page = () => {
	return (
		<div>
			<div className="flex items-center gap-x-4 p-4 mb-6 border-b border-gray-200">
				<BiArrowFromLeft className="text-lg text-gray-600" />
				<Link
					className="text-blue-500 hover:text-blue-700 transition duration-300"
					href="/super-franchise/regional-franchise/register-regional-franchise">
					Register RF
				</Link>
				<Link
					className="text-blue-500 hover:text-blue-700 transition duration-300"
					href="/super-franchise/regional-franchise/register-regional-franchise-admin">
					Register RF Admin
				</Link>
			</div>
			<RF />
		</div>
	);
};

export default page;

export const revalidate = 60;
