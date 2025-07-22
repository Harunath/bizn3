"use client";
import React, { useEffect, useState } from "react";
import Register from "./Register";
import RegisterBusiness from "./RegisterBusiness";
import { motion } from "framer-motion";
import HomeClub from "./HomeClub";
import { useRouter } from "next/navigation";
import { RegisterUserProps } from "../../../app/(auth)/register/page";
import { Session } from "next-auth";
import Phone from "./Phone";
import { useUser, Steps } from "../../../lib/store/user"; // Adjust path

const RegisterSteps = ({
	user,
	session,
}: {
	user: RegisterUserProps;
	session?: Session;
}) => {
	const { step, setStep, phoneSkipped } = useUser();
	const [progress, setProgress] = useState(1 / 3);
	const [initialProgress, setInitialProgress] = useState(0);
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	// Step redirect logic
	useEffect(() => {
		if (!user && [Steps.PHONE, Steps.BUSINESS, Steps.HOMECLUB].includes(step)) {
			router.push("/login");
			return;
		}

		if (user) {
			if (!user.phoneVerified && !phoneSkipped) {
				setStep(Steps.PHONE);
			} else if (!user.businessDetails) {
				setStep(Steps.BUSINESS);
			} else if (!user.homeClub) {
				setStep(Steps.HOMECLUB);
			} else if (!session?.user) {
				router.push("/login");
			} else {
				router.push("/");
			}
		}
		setLoading(false);
	}, []);

	const renderStep = () => {
		switch (step) {
			case Steps.USER:
				return <Register />;
			case Steps.PHONE:
				return <Phone phone={user?.phone || ""} />;
			case Steps.BUSINESS:
				if (user.businessDetails) {
					setStep(Steps.HOMECLUB);
					return;
				}
				return <RegisterBusiness userId={user?.id} />;
			case Steps.HOMECLUB:
				return <HomeClub />;
			default:
				return null;
		}
	};

	// Progress bar update
	useEffect(() => {
		switch (step) {
			case Steps.PHONE:
				setProgress(1 / 3);
				setInitialProgress(0);
				break;
			case Steps.BUSINESS:
				setProgress(2 / 3);
				setInitialProgress(1 / 3);
				break;
			case Steps.HOMECLUB:
				setProgress(1);
				setInitialProgress(2 / 3);
				break;
			default:
				break;
		}
	}, [step]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen h-full w-full flex flex-col justify-center items-center">
			{step !== Steps.USER && (
				<>
					<div className="h-2 w-80 bg-gray-200 rounded-full overflow-hidden mb-4">
						<motion.div
							initial={{ width: 320 * initialProgress }}
							animate={{
								width: 320 * progress,
								transition: { duration: 0.3, ease: "linear" },
							}}
							className="h-full rounded-full bg-blue-400"
						/>
					</div>
				</>
			)}
			{renderStep()}
		</div>
	);
};

export default RegisterSteps;
