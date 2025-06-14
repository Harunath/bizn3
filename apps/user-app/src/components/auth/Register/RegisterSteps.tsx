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
enum Steps {
	USER,
	PHONE,
	BUSINESS,
	HOMECLUB,
}

const RegisterSteps = ({
	user,
	session,
}: {
	user?: RegisterUserProps;
	session?: Session;
}) => {
	const [step, setStep] = useState<Steps>(Steps.USER);
	const [progress, setProgress] = useState(1 / 3);
	const [initialProgress, setInitialProgress] = useState(0);
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [skipped, setSkipped] = useState(false);

	useEffect(() => {
		console.log(skipped, "skipped");
		setLoading(true);
		console.log(step);
		if (
			!user &&
			(step == Steps.PHONE || step == Steps.BUSINESS || step == Steps.HOMECLUB)
		) {
			router.push("/login");
		}
		if (user) {
			if (!user.phoneVerified && !skipped) {
				setStep(Steps.PHONE);
				setLoading(false);
			} else if (!user.businessDetails) setStep(Steps.BUSINESS);
			else if (!user.homeClub) setStep(Steps.HOMECLUB);
			else if (!session || !session.user) {
				router.push("/login");
				setLoading(false);
			} else {
				router.push("/");
			}
		}
		setLoading(false);
	}, [user, router, step]);

	const nextStep = () => {
		switch (step) {
			case Steps.USER:
				setStep(Steps.PHONE);
				break;
			case Steps.PHONE:
				setStep(Steps.BUSINESS);
				break;
			case Steps.BUSINESS:
				setStep(Steps.HOMECLUB);
				break;
			case Steps.HOMECLUB:
				setStep(Steps.USER);
				break;
			default:
				setStep(Steps.USER);
				break;
		}
	};

	const renderStep = () => {
		switch (step) {
			case Steps.USER:
				return <Register />;
			case Steps.PHONE:
				return (
					<Phone
						phone={user?.phone ? user?.phone : ""}
						nextStep={nextStep}
						skip={() => {
							setSkipped(true);
							nextStep();
						}}
					/>
				);
			case Steps.BUSINESS:
				return <RegisterBusiness nextStep={nextStep} />;
			case Steps.HOMECLUB:
				return <HomeClub />;
			default:
				return null; // Or some default/error state
		}
	};

	useEffect(() => {
		const process = () => {
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
		};
		process();
	}, [step]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
			</div>
		);
	} else {
	}
	return (
		<div className="min-h-screen h-full w-full flex flex-col justify-center items-center">
			{step != Steps.USER && (
				<>
					<div className="h-2 w-80 bg-gray-200 rounded-full overflow-hidden">
						<motion.div
							initial={{
								width: 320 * initialProgress,
							}}
							animate={{
								width: 320 * progress,
								transition: {
									duration: 0.3,
									ease: "linear",
								},
							}}
							className={`h-full rounded-full bg-blue-400 transition-all duration-300`}></motion.div>
					</div>
					<button
						className="p-2 rounded bg-white text-red-500"
						onClick={() => nextStep()}>
						Next step
					</button>
				</>
			)}
			{renderStep()}
		</div>
	);
};

export default RegisterSteps;
