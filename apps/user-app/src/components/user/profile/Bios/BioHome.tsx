"use client";

import React, { useState, Suspense, lazy, useMemo } from "react";
import { useSession } from "next-auth/react";

const MyBio = lazy(() => import("./MyBio"));
const TopsProfile = lazy(() => import("./TopsProfile"));
const GainsProfile = lazy(() => import("./GainsProfile"));
const WeeklyPresentation = lazy(() => import("./WeeklyPresentation"));

const BioHome = () => {
	const { data: session, status } = useSession();
	const userId = session?.user?.id;
	const [activeTab, setActiveTab] = useState("bio");

	const tabs = useMemo(
		() => [
			{ id: "bio", label: "My Bio" },
			{ id: "tops", label: "Tops Profile" },
			{ id: "gains", label: "Gains Profile" },
			{ id: "weekly", label: "Weekly Presentation" },
		],
		[]
	);

	if (status === "loading") {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (!userId) {
		return <p className="text-center text-red-600">User is not logged in</p>;
	}

	const renderTabContent = () => {
		switch (activeTab) {
			case "bio":
				return <MyBio userId={userId} />;
			case "tops":
				return <TopsProfile userId={userId} />;
			case "gains":
				return <GainsProfile userId={userId} />;
			case "weekly":
				return <WeeklyPresentation userId={userId} />;
			default:
				return null;
		}
	};

	return (
		<div className="p-4 max-w-6xl mx-auto">
			{/* Tab Buttons */}
			<div className="flex flex-wrap gap-2 border-b mb-4 pb-2 overflow-x-auto">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`px-4 py-2 rounded-t-md font-medium transition ${
							activeTab === tab.id
								? "bg-red-600 text-white shadow"
								: "bg-gray-100 text-gray-800 hover:bg-red-100"
						}`}>
						{tab.label}
					</button>
				))}
			</div>

			{/* Tab Content */}
			<Suspense
				fallback={
					<div className="flex justify-center py-8">
						<div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
					</div>
				}>
				{renderTabContent()}
			</Suspense>
		</div>
	);
};

export default BioHome;
