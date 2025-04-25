"use client";
import { signIn } from "next-auth/react";
import { ReactNode } from "react";

const SignInButton = ({ children }: { children: ReactNode }) => {
	return (
		<div className="flex-1" onClick={() => signIn()}>
			{children}
		</div>
	);
};

export default SignInButton;
