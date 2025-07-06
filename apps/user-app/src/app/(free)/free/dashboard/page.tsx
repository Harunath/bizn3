"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRightCircle, FiUsers, FiUserPlus } from "react-icons/fi";

const page = () => {
	return (
		<div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 px-4 flex flex-col items-center">
			<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
				Free Dashboard
			</h1>

			<p className="text-lg md:text-xl text-gray-600 text-center mb-10 max-w-2xl">
				Welcome! Your free dashboard is the start of something awesome. More
				insights, stats, and features are on their way.
			</p>

			{/* Profile Link */}
			<Link
				href="/free/profile"
				className="inline-flex items-center text-red-600 hover:text-red-700 text-lg font-semibold mb-12 transition-all">
				<span>Go to Your Profile</span>
				<FiArrowRightCircle className="ml-2 text-2xl" />
			</Link>

			{/* Referral Section */}
			<div className="w-full max-w-4xl">
				<h2 className="text-center text-3xl font-bold text-gray-800 mb-8">
					🤝 Referrals
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-2">
					{/* View Referrals Card */}
					<Link
						href="/free/referral"
						className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 hover:border-red-600 transition-all duration-200 text-center">
						<div className="flex flex-col items-center text-red-600">
							<FiUsers className="text-4xl mb-3 group-hover:scale-110 transition-transform" />
							<h3 className="text-xl font-semibold text-gray-800 group-hover:text-red-700">
								View Referrals
							</h3>
							<p className="text-sm text-gray-500 mt-1">
								Check who you’ve referred
							</p>
						</div>
					</Link>

					{/* Create Referral Card */}
					<Link
						href="/free/referral/create"
						className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 hover:border-red-600 transition-all duration-200 text-center">
						<div className="flex flex-col items-center text-red-600">
							<FiUserPlus className="text-4xl mb-3 group-hover:scale-110 transition-transform" />
							<h3 className="text-xl font-semibold text-gray-800 group-hover:text-red-700">
								Create Referral
							</h3>
							<p className="text-sm text-gray-500 mt-1">
								Send a new connection
							</p>
						</div>
					</Link>
				</div>
			</div>

			<p className="mt-16 text-sm text-gray-400 text-center">
				✨ More exciting tools coming soon. Stay tuned!
			</p>
		</div>
	);
};

export default page;
