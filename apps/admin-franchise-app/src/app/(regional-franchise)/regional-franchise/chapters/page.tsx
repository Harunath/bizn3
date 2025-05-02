import Link from "next/link";
import React from "react";
import Chapters from "../../../../components/regional-franchise/chapters/Chapters";

const page = () => {
	return (
		<div className="flex flex-col items-center p-8 space-y-4 bg-gray-100">
			<Link
				href="/regional-franchise/chapters/create"
				className="px-4 py-2 bg-red-600 text-white  shadow-md hover:bg-red-700 transition duration-300 ease-in-out w-max">
				Create Chapter
			</Link>

			<div className="w-full max-w-3xl">
				<Chapters />
			</div>
		</div>
	);
};

export default page;
