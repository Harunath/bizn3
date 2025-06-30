import React from "react";
import SignOutButton from "../../../../components/common/SignOutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import ProfilePage from "../../../../components/user/profile/ProfilePage";

const page = async () => {
	const session = await getServerSession(authOptions);

	if (!session || !session.user.id) {
		return (
			<div className="flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
				<p className="text-lg font-semibold text-red-600 mb-4">
					Failed to fetch user details
				</p>
				<SignOutButton>
					<div className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition">
						Logout
					</div>
				</SignOutButton>
			</div>
		);
	}

	const res = await fetch(
		`${process.env.NEXTAUTH_URL}/api/user/${session.user.id}`
	);
	const data = await res.json();
	const user = data.data;

	return (
		<div className="bg-white px-4 sm:px-6 lg:px-12 py-4">
			{/* Header */}
			<div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-2">
				<div className="flex-1 flex justify-center items-baseline-last gap-x-2 flex-wrap">
					<div className="text-center md:text-left">
						<h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-x-1">
							<span className="text-red-600">Biz</span>
							<span className="text-black">-Network</span>
							<span className="text-sm align-top">®</span>
						</h1>

						<p className="text-gray-600 text-sm mt-1">
							Welcome back,{" "}
							<span className="font-semibold text-red-600">
								{session.user.firstname}
							</span>
						</p>
					</div>
				</div>
				<SignOutButton>
					<div className="bg-red-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition shadow">
						Logout
					</div>
				</SignOutButton>
			</div>

			{/* Profile */}
			<ProfilePage user={user} />
		</div>
	);
};

export default page;
