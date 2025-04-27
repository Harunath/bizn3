"use client";
import React from "react";
import { useSession } from "next-auth/react";
const ProfilePage = () => {
	const { data: session } = useSession();
	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
				<h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
					Profile
				</h1>

				<div className="space-y-6">
					<div className="space-y-2">
						<p className="text-lg font-semibold text-gray-800">
							Name: {session?.user.firstName} {session?.user.lastName}
						</p>
						<p className="text-lg font-semibold text-gray-800">
							Email: {session?.user.email}
						</p>
					</div>

					{session?.user.isAdmin ? (
						<div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
							<p className="text-xl text-gray-700 font-semibold">
								You are an Admin
							</p>
						</div>
					) : (
						<div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
							<p className="text-xl text-gray-700 font-semibold">
								Franchise Type: {session?.user.franchiseType}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
