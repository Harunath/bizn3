"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Session } from "next-auth";
import { UserMembershipType } from "@prisma/client";

interface WithRoleProps {
	allowedRole: UserMembershipType;
	children: ReactNode;
	session: Session | null; // Accept session as a prop
}

const WithRole = ({ allowedRole, children, session }: WithRoleProps) => {
	const router = useRouter();

	useEffect(() => {
		if (!session || session.user.membershipType !== allowedRole) {
			router.replace("/unauthorized"); // Redirect unauthorized users
		}
	}, [session, router, allowedRole]);

	if (!session) {
		return <p>Loading...</p>;
	}

	return <>{children}</>;
};

export default WithRole;
