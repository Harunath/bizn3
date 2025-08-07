"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRightCircle, FiUsers, FiUserPlus } from "react-icons/fi";

const Page = () => {
	const [loadingProfile, setLoadingProfile] = useState(false);
	const router = useRouter();

	const handleProfileClick = () => {
		setLoadingProfile(true);
		router.push("/free/profile");
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 px-4 flex flex-col items-center">
			<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
				Your Free Dashboard
			</h1>

			<p className="text-lg md:text-xl text-gray-600 text-center mb-10 max-w-2xl">
				Welcome aboard! This is your starting point for tracking referrals and
				building connections. More insights and features will be added soon.
			</p>

			{/* Profile Button */}
			<button
				onClick={handleProfileClick}
				disabled={loadingProfile}
				className="inline-flex items-center text-red-600 hover:text-red-700 text-lg font-semibold mb-12 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
				{loadingProfile ? (
					<span className="flex items-center">
						<svg
							className="animate-spin h-5 w-5 mr-2 text-red-600"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24">
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
						</svg>
						Loading Profile...
					</span>
				) : (
					<>
						<span>Go to My Profile</span>
						<FiArrowRightCircle className="ml-2 text-2xl" />
					</>
				)}
			</button>

			{/* Referral Section */}
			<div className="w-full max-w-4xl">
				<h2 className="text-center text-3xl font-bold text-gray-800 mb-8">
					🤝 Manage Referrals
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-2">
					{/* View Referrals Card */}
					<a
						href="/free/referral"
						className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 hover:border-red-600 transition-all duration-200 text-center">
						<div className="flex flex-col items-center text-red-600">
							<FiUsers className="text-4xl mb-3 group-hover:scale-110 transition-transform" />
							<h3 className="text-xl font-semibold text-gray-800 group-hover:text-red-700">
								View Received Referrals
							</h3>
							<p className="text-sm text-gray-500 mt-1">
								See who referred you and grow your network.
							</p>
						</div>
					</a>

					{/* Create Referral Card */}
					<a
						href="/free/referral/create"
						className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 hover:border-red-600 transition-all duration-200 text-center">
						<div className="flex flex-col items-center text-red-600">
							<FiUserPlus className="text-4xl mb-3 group-hover:scale-110 transition-transform" />
							<h3 className="text-xl font-semibold text-gray-800 group-hover:text-red-700">
								Create a Referral
							</h3>
							<p className="text-sm text-gray-500 mt-1">
								Help others connect and collaborate.
							</p>
						</div>
					</a>

					{/* Referrals I Created Card */}
					<a
						href="/free/referral/referralsICreated"
						className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 hover:border-red-600 transition-all duration-200 text-center">
						<div className="flex flex-col items-center text-red-600">
							<FiUserPlus className="text-4xl mb-3 group-hover:scale-110 transition-transform" />
							<h3 className="text-xl font-semibold text-gray-800 group-hover:text-red-700">
								My Sent Referrals
							</h3>
							<p className="text-sm text-gray-500 mt-1">
								Track the connections you&apos;ve initiated.
							</p>
						</div>
					</a>
				</div>
			</div>

			<p className="mt-16 text-sm text-gray-400 text-center">
				✨ Exciting new tools are in the works. Stay tuned for updates!
			</p>
		</div>
	);
};

export default Page;
