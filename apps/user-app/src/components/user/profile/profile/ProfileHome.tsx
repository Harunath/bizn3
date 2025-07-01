"use client";

import React, { useEffect, useState, useCallback } from "react";
import PersonalDetailsComp from "./PersonalDetails";
import ContactDetailsComp from "./ContactDetails";
import AddressComp from "./Address";
import { useSession } from "next-auth/react";
import UserProfile from "./Userprofile";
import { toast } from "react-toastify";
import { PersonalDetails, ContactDetails, Address } from "@repo/db/client";

interface UserType {
	id: string;
	email: string;
	phone: string;
	firstname: string;
	lastname: string;
	profileImage: string;
	personalDetails: PersonalDetails;
	contactDetails: ContactDetails;
	fullAddress: Address;
}

const tabs = [
	{ id: "profile", label: "User Profile" },
	{ id: "personal", label: "Personal Details" },
	{ id: "contact", label: "Professional Address" },
	{ id: "address", label: "Personal Address" },
];

function ProfileHome() {
	const { data: sessionData, status } = useSession();
	const userId = sessionData?.user?.id;

	const [user, setUser] = useState<UserType | null>(null);
	const [activeTab, setActiveTab] = useState("profile");
	const [loading, setLoading] = useState(false);

	const fetchUser = useCallback(async () => {
		if (!userId) return;
		try {
			setLoading(true);
			const response = await fetch(`/api/user/${userId}/my-profile`);
			const data = await response.json();

			if (data.message !== "success") {
				toast.error("Error fetching the User details");
				throw new Error(data.message);
			}

			setUser(data.data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, [userId]);

	useEffect(() => {
		if (status === "authenticated" && userId) {
			fetchUser();
		}
	}, [status, userId, fetchUser]);

	if (!userId) {
		return <p className="text-center text-red-600">User is not logged in</p>;
	}

	if (status === "loading" || loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
			{/* Tab Buttons */}
			<div className="flex flex-wrap gap-2 border-b border-gray-200 mb-4 pb-2 overflow-x-auto">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`px-4 py-2 rounded-t-md font-medium whitespace-nowrap transition-all duration-150
							${
								activeTab === tab.id
									? "bg-red-600 text-white shadow"
									: "bg-gray-100 text-gray-800 hover:bg-red-100"
							}`}>
						{tab.label}
					</button>
				))}
			</div>

			{/* Tab Content */}
			<div className="p-4 sm:p-6">
				{user && (
					<>
						{activeTab === "profile" && (
							<UserProfile
								userId={userId}
								profileImageUrl={user.profileImage || ""}
							/>
						)}

						{activeTab === "personal" && (
							<PersonalDetailsComp
								userId={userId}
								personalDetails={user.personalDetails}
							/>
						)}

						{activeTab === "contact" && (
							<ContactDetailsComp
								userId={userId}
								contactDetails={user.contactDetails}
							/>
						)}

						{activeTab === "address" && (
							<AddressComp userId={userId} addressProp={user.fullAddress} />
						)}
					</>
				)}
			</div>
		</div>
	);
}

export default ProfileHome;
