"use client";
import React from "react";
import { useSession } from "next-auth/react";
const ProfilePage = () => {
	const { data: session } = useSession();
	return (
		<div>
			<div>
				<h1 className="text-2xl font-bold">Profile</h1>
				<div className="mt-4">
					<p className="text-lg font-semibold">
						Name: {session?.user.firstName} {session?.user.lastName}
					</p>
					<p className="text-lg font-semibold">Email: {session?.user.email}</p>
				</div>
				{session?.user.isAdmin ? (
					<div>
						<p>You are an Admin</p>
					</div>
				) : (
					<div>
						<p>Franchise Type : {session?.user.franchiseType}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProfilePage;
