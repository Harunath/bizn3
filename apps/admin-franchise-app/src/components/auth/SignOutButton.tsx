"use client";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

function SignOutButton() {
	useEffect(() => {
		signOut({ callbackUrl: "/login" });
	}, []);
	return <div>Signing out...</div>;
}

export default SignOutButton;
