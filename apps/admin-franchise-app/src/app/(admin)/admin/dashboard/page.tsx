import Link from "next/link";
import React from "react";
import { BiArrowFromLeft } from "react-icons/bi";

const page = () => {
	return (
		<div className="p-6 mx-auto bg-white shadow-lg rounded-lg">
			<div className="flex items-center gap-x-4 p-4 mb-6 border-b border-gray-200">
				<BiArrowFromLeft className="text-lg text-gray-600" />
				<Link
					className="text-blue-500 hover:text-blue-700 transition duration-300"
					href="/admin/countries">
					Countries
				</Link>
				<Link
					className="text-blue-500 hover:text-blue-700 transition duration-300"
					href="/admin/franchise">
					Franchise
				</Link>
			</div>
			<h2 className="text-3xl font-semibold text-gray-800 mb-4">
				Admin Dashboard
			</h2>
			<p className="text-gray-600 leading-relaxed">
				Welcome to the admin dashboard! Here you can manage your franchise
				operations, including creating and managing countries, franchises, and
				franchise admins. Use the links above to navigate to different sections
				of the admin panel.
			</p>
		</div>
	);
};

export default page;
