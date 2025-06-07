"use client";

import React from "react";
import PersonalDetails from "./PersonalDetails";
import ContactDetails from "./ContactDetails";
import Address from "./Address";
import { useSession } from "next-auth/react";

function ProfileHome() {
	const session = useSession();
	if (!session || !session.data?.user.id) {
		return <>User is not logged in</>;
	}
	return (
		<>
			<PersonalDetails userId={session.data?.user.id} />
			<ContactDetails userId={session.data?.user.id} />
			<Address userId={session.data?.user.id} />
		</>
	);
}

export default ProfileHome;
