"use client";
import { signOut } from "next-auth/react";
import React, { ReactNode } from "react";

const SignOutButton = ({ children }: { children: ReactNode }) => {
	return <div onClick={() => signOut()}>{children}</div>;
};

export default SignOutButton;
