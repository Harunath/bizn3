"use client";
import React, { useEffect, useState } from "react";
import Register from "./Register";
import RegisterBusiness from "./RegisterBusiness";
import VerifyBusiness from "./VerifyBusiness";
import { motion } from "framer-motion";
import HomeClub from "./HomeClub";
import { useRouter } from "next/navigation";
import { RegisterUserProps } from "../../../app/(auth)/register/page";
import { Session } from "next-auth";
enum Steps {
	USER,
	BUSINESS,
	VERIFYBUSINESS,
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

	useEffect(() => {
		setLoading(true);
		if (user) {
			console.log(user);
			if (!user.businessDetails) {
				setStep(Steps.BUSINESS);
				setLoading(false);
			} else if (!user.homeClub) setStep(Steps.HOMECLUB);
			else if (!session || !session.user) {
				router.push("/login");
				setLoading(false);
			} else {
				router.push("/");
			}
		}
		setLoading(false);
	}, [user, router]);

	const nextStep = () => {
		switch (step) {
			case Steps.USER:
				setStep(Steps.BUSINESS);
				break;
			case Steps.BUSINESS:
				setStep(Steps.VERIFYBUSINESS);
				break;
			case Steps.VERIFYBUSINESS:
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
				return <Register nextStep={nextStep} />;
			case Steps.BUSINESS:
				return <RegisterBusiness nextStep={nextStep} />;
			case Steps.VERIFYBUSINESS:
				return <VerifyBusiness nextStep={nextStep} />;
			case Steps.HOMECLUB:
				return <HomeClub />;
			default:
				return null; // Or some default/error state
		}
	};

	useEffect(() => {
		const process = () => {
			switch (step) {
				case Steps.USER:
					setProgress(1 / 4);
					setInitialProgress(0);
					break;
				case Steps.BUSINESS:
					setProgress(1 / 2);
					setInitialProgress(1 / 4);
					break;
				case Steps.VERIFYBUSINESS:
					setProgress(3 / 4);
					setInitialProgress(1 / 2);
					break;
				case Steps.HOMECLUB:
					setProgress(1);
					setInitialProgress(3 / 4);
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
		<div className="min-h-screen h-full w-full flex justify-center items-center">
			{step != Steps.USER && (
				<>
					<div className="h-2 w-80 bg-white rounded-full overflow-hidden">
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
