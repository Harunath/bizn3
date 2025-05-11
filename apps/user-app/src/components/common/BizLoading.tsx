"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserMembershipType } from "@repo/db/client";

const BizLoading = () => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { data: session } = useSession();
	const [route, setRoute] = useState<string | null>(null);
	useEffect(() => {
		if (session && session.user) {
			if (session.user.membershipType === UserMembershipType.VIP) {
				setRoute("/vip/dashboard");
			} else if (session.user.membershipType === UserMembershipType.GOLD) {
				setRoute("/gold/dashboard");
			} else if (session.user.membershipType === UserMembershipType.FREE)
				setRoute("/free/dashboard");
		} else {
			router.push("/login");
		}

		setLoading(false);
	}, [loading]);
	if (!loading && route)
		return (
			<>
				<div className="h-screen w-screen">
					<div className=" relative h-full w-full flex justify-center items-center bg-red-500 text-white">
						<div>
							<p className=" text-5xl">Biz Network</p>
							<p className="text-sm">
								Biz Network tagline Biz Network tagline Biz Network tagline
							</p>
						</div>
					</div>
					<motion.div
						initial={{
							width: "100vw",
							height: "100vh",
							x: 0,
						}}
						animate={{
							x: "100vw",
							width: 0,
							transition: {
								duration: 2,
								ease: "easeInOut",
							},
						}}
						onAnimationComplete={() => {
							setLoading(true);
							router.push(route);
						}}
						className=" absolute inset-0 bg-white"
					/>
				</div>
			</>
		);
};

export default BizLoading;
