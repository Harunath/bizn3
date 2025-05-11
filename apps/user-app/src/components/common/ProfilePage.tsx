"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { User, BusinessDetails } from "@repo/db/client";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import { GoUnverified } from "react-icons/go";
import Image from "next/image";

interface ProfileProps extends Omit<User, "password"> {
	businessDetails: BusinessDetails;
}
const ProfilePage = ({ user }: { user?: ProfileProps }) => {
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
							Name: {session?.user.firstname} {session?.user.lastname}
						</p>
						<p className="text-lg font-semibold text-gray-800">
							Email: {session?.user.email}
						</p>
					</div>

					<div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
						<p className="text-xl text-gray-700 font-semibold">
							Franchise Type: {session?.user.membershipType}
						</p>
					</div>
					{user && (
						<div>
							<p>
								{user.firstname + " " + user.lastname + " "}
								<span>
									{user.registrationCompleted ? (
										<span className="text-xs">
											{" "}
											registration inComplete{" "}
											<RiVerifiedBadgeLine className="text-green-400" />
										</span>
									) : (
										<span>
											registration inComplete{" "}
											<GoUnverified className="text-red-600" />
										</span>
									)}
								</span>
							</p>
							<p>{user.bio ? user.bio : "no bio"}</p>
							<p>
								<span>Email :</span> {user.phone}{" "}
								{user.emailVerified ? (
									<span className="text-xs">
										{" "}
										verified :<RiVerifiedBadgeLine className="text-green-400" />
									</span>
								) : (
									<span>
										Unverified : <GoUnverified className="text-red-600" />
									</span>
								)}
							</p>
							<p>
								<span>Phone :</span> {user.phone}{" "}
								{user.phoneVerified ? (
									<span className="text-xs">
										{" "}
										verified :<RiVerifiedBadgeLine className="text-green-400" />
									</span>
								) : (
									<span>
										Unverified : <GoUnverified className="text-red-600" />
									</span>
								)}
							</p>
							<Image
								src={
									user.profileImage
										? user.profileImage
										: "https://res.cloudinary.com/degrggosz/image/upload/v1741262734/task-management-system-screenshot-1_dmv2aa.png"
								}
								className="h-40 w-40 rounded-full"
								height={160}
								width={160}
								alt="profile image"
							/>
							{user.address ? (
								<p>{JSON.stringify(user.address)}</p>
							) : (
								<p>No address</p>
							)}
							{user.businessDetails && (
								<div>
									<p className="text-2xl text-red-600">Business Details</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
