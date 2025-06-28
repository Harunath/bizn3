import React from "react";
import Link from "next/link";
import { FiArrowRightCircle } from "react-icons/fi";

const page = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
			<h1 className="text-3xl font-bold text-gray-800 mb-4">Gold Dashboard</h1>

			<p className="text-lg text-gray-600 text-center mb-6 max-w-xl">
				In the future, you&apos;ll see stats,referals and more
			</p>

			<div className="text-blue-600 flex items-center space-x-2 hover:underline">
				<Link href="/gold/profile">
					<span className="text-xl font-medium">Head to your profile</span>
				</Link>
				<FiArrowRightCircle className="text-2xl" />
			</div>

			<p className="mt-10 text-sm text-gray-400">
				More features coming soon 🚀
			</p>
			<div className="mt-4">
				<h2 className="text-center text-4xl">Referrals</h2>
				<div className="flex gap-4 items-center">
					<Link href="/gold/referral">Referral</Link>
					<Link href="/gold/referral/create">Create Referral</Link>
				</div>
			</div>
		</div>
	);
};

export default page;
