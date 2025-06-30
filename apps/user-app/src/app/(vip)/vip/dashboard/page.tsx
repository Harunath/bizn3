"use client";
import React from "react";
import Link from "next/link";
import { FiArrowRightCircle, FiUsers, FiUserPlus } from "react-icons/fi";

const page = () => {
	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center justify-center">
			<h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
				VIP Dashboard
			</h1>

			<p className="text-lg text-gray-600 text-center mb-6 max-w-xl">
				In the future, you&apos;ll see stats, referrals, and more.
			</p>

			{/* Profile Link */}
			<div className="text-blue-600 flex items-center space-x-2 hover:text-blue-700 transition-colors mb-10">
				<Link href="/vip/profile">
					<span className="text-xl font-medium">Head to your profile</span>
				</Link>
				<FiArrowRightCircle className="text-2xl" />
			</div>

			{/* Referral Section as Cards */}
			<div className="mt-4 w-full max-w-2xl">
				<h2 className="text-center text-4xl font-semibold text-gray-800 mb-6">
					Referrals
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					{/* View Referrals Card */}
					<Link
						href="/vip/referral"
						className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg border border-transparent hover:border-blue-600 transition">
						<div className="flex flex-col items-center text-blue-600">
							<FiUsers className="text-3xl mb-2" />
							<h3 className="text-lg font-semibold text-gray-800">
								View Referrals
							</h3>
						</div>
					</Link>

					{/* Create Referral Card */}
					<Link
						href="/vip/referral/create"
						className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg border border-transparent hover:border-blue-600 transition">
						<div className="flex flex-col items-center text-blue-600">
							<FiUserPlus className="text-3xl mb-2" />
							<h3 className="text-lg font-semibold text-gray-800">
								Create Referral
							</h3>
						</div>
					</Link>
				</div>
			</div>

			<p className="mt-12 text-sm text-gray-400">
				More features coming soon 🚀
			</p>
		</div>
	);
};

export default page;
