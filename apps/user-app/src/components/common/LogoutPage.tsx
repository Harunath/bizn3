"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
	useEffect(() => {
		signOut({ callbackUrl: "/" }); // Redirect after sign out
	}, []);

	return <p>Signing out...</p>;
}
