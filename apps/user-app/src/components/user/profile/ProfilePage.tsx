"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { User, BusinessDetails } from "@repo/db/client";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import { GoUnverified } from "react-icons/go";
import Image from "next/image";
import Link from "next/link";
import { FaChevronRight, FaEdit } from "react-icons/fa";

interface ProfileProps extends Omit<User, "password"> {
	businessDetails: BusinessDetails;
}
const ProfilePage = ({ user }: { user?: ProfileProps }) => {
	const { data: session } = useSession();
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-12 px-4 sm:px-6 lg:px-8">
			<div className="border border-gray-200 rounded-xl p-4">
				<h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
					Account
				</h2>

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
				</div>
			</div>
			{user && (
				<div className="border border-gray-200 rounded-xl p-4 text-lg font-semibold text-gray-800  relative">
					<Link
						href={"/free/profile/personal-details"}
						className="absolute right-4 top-4 opacity-30 hover:opacity-100 rounded-lg text-sm text-red-600 flex items-center gap-x-2">
						Edit <FaEdit />
					</Link>

					<h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
						Personal details
					</h2>
					<div className="space-y-2">
						<div className="flex items-center gap-x-2  flex-wrap">
							<div className="w-1/2 flex justify-between items-center gap-x-2">
								<p>Name</p> <span>:</span>
							</div>
							<p className="flex-1 flex items-center gap-x-2 whitespace-nowrap">
								{user.firstname + " " + user.lastname + " "}
								<span>
									{user.registrationCompleted ? (
										<RiVerifiedBadgeLine className="text-green-400" />
									) : (
										<GoUnverified className="text-red-600" />
									)}
								</span>
							</p>
						</div>
						<div className="flex items-center gap-x-2 flex-wrap">
							<div className="w-1/2 flex justify-between items-center gap-x-2">
								<p>Email</p> <span>:</span>
							</div>
							<p className="flex-1 flex items-center gap-x-2  whitespace-nowrap">
								{user.email}

								<span>
									{user.emailVerified ? (
										<RiVerifiedBadgeLine className="text-green-400" />
									) : (
										<GoUnverified className="text-red-600" />
									)}
								</span>
							</p>
						</div>
						<div className="flex items-center gap-x-2">
							<div className="w-1/2 flex justify-between items-center gap-x-2">
								<p>Phone</p> <span>:</span>
							</div>
							<p className="flex-1 flex items-center gap-x-2">
								{user.phone}

								<span>
									{user.phoneVerified ? (
										<RiVerifiedBadgeLine className="text-green-400" />
									) : (
										<GoUnverified className="text-red-600" />
									)}
								</span>
							</p>
						</div>
						<div>
							<Image
								src={
									user.profileImage
										? user.profileImage
										: "https://res.cloudinary.com/degrggosz/image/upload/v1741262734/task-management-system-screenshot-1_dmv2aa.png"
								}
								alt="profile image"
								width={600}
								height={400}
								className="hidden lg:block w-full h-auto"
							/>
							<Image
								src={
									user.profileImage
										? user.profileImage
										: "https://res.cloudinary.com/degrggosz/image/upload/v1741262734/task-management-system-screenshot-1_dmv2aa.png"
								}
								alt="profile image"
								width={300}
								height={200}
								className="block lg:hidden w-full h-auto"
							/>
						</div>
					</div>
				</div>
			)}
			{user && user.businessDetails && (
				<div className="border border-gray-200 rounded-xl p-4 text-lg font-semibold text-gray-800">
					<h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
						Business Registration
					</h2>
					<div className="space-y-2">
						<div className="flex items-center gap-x-2 flex-wrap">
							<div className="w-1/2 flex justify-between items-center gap-x-2">
								<p>Business name</p> <span>:</span>
							</div>
							<p className="flex-1  whitespace-nowrap">
								{user.businessDetails.businessName}
							</p>
						</div>
						<div className="flex items-center gap-x-2 flex-wrap">
							<div className="w-1/2 flex justify-between items-center gap-x-2">
								<p>Category</p> <span>:</span>
							</div>
							<p className="flex-1  whitespace-nowrap">
								{user.businessDetails.category}
								<p>After upgrade we will also get subcategories</p>
							</p>
						</div>

						<div className="grid gap-2">
							{user.businessDetails.images.map((image, index) => (
								<>
									<Image
										src={image}
										alt={user.businessDetails + " image " + index}
										key={user.businessDetails.id + index + "desktop-view"}
										width={600}
										height={400}
										className="hidden lg:block"
									/>
									<Image
										src={image}
										alt={user.businessDetails + " image " + index}
										key={user.businessDetails.id + index + "mobile-view"}
										width={300}
										height={200}
										className="block lg:hidden"
									/>
								</>
							))}
						</div>
					</div>
				</div>
			)}

			{user && (
				<div className="border border-gray-200 rounded-xl p-4 text-lg font-semibold text-gray-800 relative">
					<Link
						href={"/free/profile/bios"}
						className="absolute right-4 top-4 opacity-70 hover:opacity-100 rounded-md text-red-600 text-sm flex items-center gap-1 transition duration-200">
						<FaEdit className="text-base" />
						<span className="font-semibold">Edit</span>
					</Link>

					<h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
						My Bio
					</h2>

					<div className="grid divide-y border rounded-lg overflow-hidden">
						{[
							{ label: "GAINS Profile", href: "/free/profile/bios" },
							{ label: "My Bio", href: "/free/profile/bios" },
							{ label: "Tops Profile", href: "/free/profile/bios" },
							{
								label: "Weekly Presentations",
								href: "/free/profile/bios",
							},
						].map((item) => (
							<Link
								key={item.label}
								href={item.href}
								className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 transition duration-200">
								<span className="text-gray-800">{item.label}</span>
								<FaChevronRight className="text-gray-400" />
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ProfilePage;
