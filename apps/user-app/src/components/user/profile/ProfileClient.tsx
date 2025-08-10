// components/user/profile/ProfileClient.tsx
"use client";

import { useEffect } from "react";
import {
	useUserStore,
	type ProfileProps,
	type ContactDetails,
} from "../../../lib/store/useUserStore";
import type {
	ProfilePropsWire,
	ContactDetailsWire,
} from "../../../lib/server/profile";
import ProfilePage from "./ProfilePage";

type Props = {
	initialUser: ProfilePropsWire;
	initialContactDetails: ContactDetailsWire | null;
};

function reviveDate(value: string | null | undefined): Date | null {
	if (!value) return null;
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? null : d;
}

function reviveProfile(w: ProfilePropsWire): ProfileProps {
	return {
		id: w.id,
		firstname: w.firstname,
		lastname: w.lastname,
		email: w.email,
		homeClubId: w.homeClubId,
		membershipType: w.membershipType,

		// ✅ handle nullable relation + fill defaults for possibly-undefined fields
		businessDetails: {
			...w.businessDetails,
			createdAt: reviveDate(w.businessDetails.createdAt)!,
			updatedAt: reviveDate(w.businessDetails.updatedAt)!,
		},

		emailVerified: w.emailVerified,
		phone: w.phone,
		phoneVerified: w.phoneVerified,
		registrationCompleted: w.registrationCompleted,
		profileImage: w.profileImage,
		deleted: w.deleted,
		deactivated: w.deactivated,

		// If these can be null in DB, either make them `Date | null` in your type
		// or provide a fallback here:
		membershipStartDate: reviveDate(w.membershipStartDate)!,
		membershipEndDate: reviveDate(w.membershipEndDate)!,

		leadingChapterId: w.leadingChapterId,
		leadingClubId: w.leadingClubId,

		createdAt: reviveDate(w.createdAt)!,
		updatedAt: reviveDate(w.updatedAt)!,
	};
}

function reviveContact(w: ContactDetailsWire): ContactDetails {
	return {
		...w,
		createdAt: reviveDate(w.createdAt)!,
		updatedAt: reviveDate(w.updatedAt)!,
	};
}

export default function ProfileClient({
	initialUser,
	initialContactDetails,
}: Props) {
	const { user, contactDetails, initialized, setFromInitial } = useUserStore();

	useEffect(() => {
		if (!initialized && initialUser) {
			const revivedUser = reviveProfile(initialUser);
			const revivedContact = initialContactDetails
				? reviveContact(initialContactDetails)
				: null;

			setFromInitial(revivedUser, revivedContact);
		}
	}, [initialized, initialUser, initialContactDetails, setFromInitial]);

	// ✅ Only gate on user; contactDetails can be null
	if (!user) return <div className="p-4">Loading…</div>;

	return <ProfilePage user={user} contactDetailsRes={contactDetails} />;
}
