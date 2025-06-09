"use client";

import React, { useState } from "react";
import MyBio from "./MyBio";
import TopsProfile from "./TopsProfile";
import GainsProfile from "./GainsProfile";
import WeeklyPresentation from "./WeeklyPresentation";
import { useSession } from "next-auth/react";

const tabs = [
	{ id: "bio", label: "My Bio" },
	{ id: "tops", label: "Tops Profile" },
	{ id: "gains", label: "Gains Profile" },
	{ id: "weekly", label: "Weekly Presentation" },
];

function BioHome() {
	const session = useSession();
	const userId = session.data?.user.id;
	const [activeTab, setActiveTab] = useState("bio");

	if (session.status === "loading") {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (!userId) {
		return <>User is not logged in</>;
	}

	return (
		<div className="p-4">
			{/* Tab Buttons */}
			<div className="flex gap-2 border-b mb-4 pb-2">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`px-4 py-2 rounded-t-md font-medium ${
							activeTab === tab.id
								? "bg-red-600 text-white"
								: "bg-gray-100 text-gray-800"
						}`}>
						{tab.label}
					</button>
				))}
			</div>

			{/* Tab Content */}
			<div className="rounded-b-md shadow-sm">
				{activeTab === "bio" && <MyBio userId={userId} />}
				{activeTab === "tops" && <TopsProfile userId={userId} />}
				{activeTab === "gains" && <GainsProfile userId={userId} />}
				{activeTab === "weekly" && <WeeklyPresentation userId={userId} />}
			</div>
		</div>
	);
}

export default BioHome;
