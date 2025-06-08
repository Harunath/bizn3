"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserMembershipType } from "@repo/db/client";

const BizLoading = () => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [route, setRoute] = useState<string | null>(null);

	useEffect(() => {
		if (status === "loading") return; // Wait until session is ready

		if (status === "unauthenticated") {
			router.push("/login");
			return;
		}

		if (session) {
			if (session.user) {
				if (!session.user.businessId || !session.user.homeClub) {
					router.push("/register");
					return;
				}
				switch (session.user.membershipType) {
					case UserMembershipType.VIP:
						setRoute("/vip/dashboard");
						break;
					case UserMembershipType.GOLD:
						setRoute("/gold/dashboard");
						break;
					case UserMembershipType.FREE:
						setRoute("/free/dashboard");
						break;
					default:
						router.push("/login");
				}
			}
		}
	}, [status, session, router]);

	return (
		<div className="h-screen w-screen">
			<div className="relative h-full w-full flex justify-center items-center bg-red-500 text-white">
				<div>
					<p className="text-5xl">Biz Network</p>
					<p className="text-sm">
						Welcome{" "}
						{session?.user ? " " + session?.user.firstname + " " : " User "} To
						Biz Network
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
					if (route) router.push(route);
				}}
				className="absolute inset-0 bg-white"
			/>
		</div>
	);
};

export default BizLoading;
