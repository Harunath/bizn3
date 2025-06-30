"use client";

import React from "react";
import dynamic from "next/dynamic";

// Red spinner loader
const Loader = () => (
	<div className="flex justify-center items-center py-12">
		<div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
	</div>
);

// Dynamically import GoldUpgrade with loader
const GoldUpgrade = dynamic(
	() => import("../../../../../components/user/free/upgrade/GoldUpgrade"),
	{
		loading: () => <Loader />,
		ssr: false,
	}
);

export default function Page() {
	return (
		<div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
			<div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 space-y-6 border-t-4 border-red-600">
				<h1 className="text-3xl font-bold text-gray-800 text-center">
					Upgrade to <span className="text-red-600">Gold Membership</span>
				</h1>
				<p className="text-gray-600 text-center text-lg">
					Enjoy premium features, unlock referral insights, and stand out in
					your network.
				</p>

				<div className="pt-4">
					<GoldUpgrade />
				</div>
			</div>
		</div>
	);
}
