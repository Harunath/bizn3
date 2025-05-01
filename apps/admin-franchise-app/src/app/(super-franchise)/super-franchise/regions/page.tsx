import Link from "next/link";
import React from "react";
import Regions from "../../../../components/super-franchise/region/Regions";

const page = () => {
	return (
		<div className="flex flex-col items-center p-8 space-y-4 bg-gray-100">
			<Link
				href="/super-franchise/regions/create"
				className="px-4 py-2 bg-red-600 text-white  shadow-md hover:bg-red-700 transition duration-300 ease-in-out w-max">
				Create Region
			</Link>

			<div className="w-full max-w-3xl">
				<Regions />
			</div>
		</div>
	);
};

export default page;
