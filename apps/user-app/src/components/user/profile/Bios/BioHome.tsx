"use client";
import React from "react";
import MyBio from "./MyBio";
import TopsProfile from "./TopsProfile";
import GainsProfile from "./GainsProfile";
import WeeklyPresentation from "./WeeklyPresentation";
import { useSession } from "next-auth/react";

function BioHome() {
	const session = useSession();
	if (!session || !session.data?.user.id) {
		return <>User is not logged in</>;
	}
	return (
		<>
			<MyBio userId={session.data?.user.id} />
			<TopsProfile userId={session.data?.user.id} />
			<GainsProfile userId={session.data?.user.id} />
			<WeeklyPresentation userId={session.data?.user.id} />
		</>
	);
}

export default BioHome;
