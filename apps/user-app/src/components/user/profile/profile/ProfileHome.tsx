"use client";

import React, { useEffect, useState } from "react";
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
	const session = useSession();
	const [user, setUser] = useState<UserType>();
	const userId = session.data?.user.id;
	const [activeTab, setActiveTab] = useState("profile");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (session.data?.user) fetchUser();
	}, [session.status]);

	const fetchUser = async () => {
		setLoading(true);
		const response = await fetch(`/api/user/${userId}/my-profile`);
		const data = await response.json();
		if (data.message != "success") {
			toast.error("Error fetching the User details");
			setLoading(false);
			throw new Error(data.message);
		} else {
			setUser(data.data);
			setLoading(false);
		}
	};

	if (!userId) {
		return <>User is not logged in</>;
	}

	if (session.status === "loading" || loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="p-4">
			{/* Tab Buttons */}
			<div className="flex gap-2 border-b mb-4 pb-2">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`px-4 py-2 rounded-t-md font-medium ${
							activeTab === tab.id
								? "bg-red-600 text-white"
								: "bg-gray-100 text-gray-800"
						}`}>
						{tab.label}
					</button>
				))}
			</div>

			{/* Tab Content */}
			<div className="rounded-b-md shadow-sm">
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
