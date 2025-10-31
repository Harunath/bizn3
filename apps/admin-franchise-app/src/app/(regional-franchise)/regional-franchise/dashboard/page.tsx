import Link from "next/link";
import React from "react";
import { BiArrowFromLeft } from "react-icons/bi";
import UpgradeRequests from "../../../../components/regional-franchise/UpgradeRequests/GetUpgradeRequests";

const page = () => {
	return (
		<div>
			Common dashboard
			<div className="flex items-center gap-x-4 p-4 mb-6 border-b border-gray-200">
				<BiArrowFromLeft className="text-lg text-gray-600" />
				<Link
					className="text-blue-500 hover:text-blue-700 transition duration-300"
					href="/regional-franchise/chapters">
					Chapters
				</Link>
			</div>
			<h2 className=" text-3xl text-red-500">Common dashboard</h2>
			<p>
				Welcome to the common franchise dashboard! Here you can manage your
				franchise operations, including creating and managing chapters, and
				chapter leaders. Use the link above to navigate to different sections of
				the admin panel.
			</p>
			<div>
				<div>
					<UpgradeRequests />
				</div>
			</div>
		</div>
	);
};

export default page;
