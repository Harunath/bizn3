"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Session } from "next-auth";

interface WithRoleProps {
	children: ReactNode;
	session: Session | null; // Accept session as a prop
}

const WithAdmin = ({ children, session }: WithRoleProps) => {
	const router = useRouter();

	useEffect(() => {
		if (!session || !session.user.isAdmin) {
			router.replace("/unauthorized"); // Redirect unauthorized users
		}
	}, [session, router]);

	if (!session) {
		return <p>Loading...</p>;
	}

	return <>{children}</>;
};

export default WithAdmin;
