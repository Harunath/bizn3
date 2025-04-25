"use client";
import React from "react";
import { useSession } from "next-auth/react";
import SignInButton from "./SignInButton";
import Link from "next/link";
import { FranchiseType } from "@prisma/client";

const ProfileOrSignin = () => {
	const rolePaths: Record<FranchiseType, string> = {
		MASTER_FRANCHISE: "/master-franchise/profile",
		SUPER_FRANCHISE: "/super-franchise/profile",
		REGIONAL_FRANCHISE: "/regional-franchise/profile",
	};
	const session = useSession();
	return (
		<div>
			{session.data?.user.id ? (
				session.data.user.isAdmin ? (
					<Link href="/admin/dashboard">
						<button className="px-4 py-1 text-white bg-red-600 rounded-2xl transition-all duration-300 hover:bg-white hover:text-red-600 border-2 border-red-600">
							{session.data.user.firstName} Dashboard
						</button>
					</Link>
				) : (
					<Link href={rolePaths[session.data.user.franchiseType!] || "/login"}>
						<button className="px-4 py-1 text-white bg-red-600 rounded-2xl transition-all duration-300 hover:bg-white hover:text-red-600 border-2 border-red-600">
							{session.data.user.firstName} Dashboard
						</button>
					</Link>
				)
			) : (
				<SignInButton>
					<button className="px-4 py-1 text-white bg-red-600 rounded-2xl transition-all duration-300 hover:bg-white hover:text-red-600 border-2 border-red-600">
						Login
					</button>
				</SignInButton>
			)}
		</div>
	);
};

export default ProfileOrSignin;
