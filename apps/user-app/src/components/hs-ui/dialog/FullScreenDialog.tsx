import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode } from "react";

const FullScreenDialog = ({ children }: { children: ReactNode }) => {
	// const variants = {
	// 	initial: {
	// 		opactity: 0,
	// 		scale: 0, // Changed from scale to opacity for better full-screen transition
	// 	},
	// 	animate: {
	// 		opacity: 1,
	// 		scale: 1,
	// 		transition: {
	// 			duration: 0.3,
	// 			ease: "easeInOut",
	// 		},
	// 	},
	// 	exit: {
	// 		scale: 0, // Changed from scale to opacity
	// 		opacity: 0,
	// 		transition: {
	// 			duration: 0.2,
	// 		},
	// 	},
	// };
	return (
		<motion.div
			className="fixed inset-0 rounded-xl bg-gray-200 shadow-2xl shadow-black p-4 flex items-center justify-center" // Added flex for centering
			style={{ zIndex: 10 }} // Ensure dialog is on top
		>
			<AnimatePresence mode="wait">
				<motion.div>{children}</motion.div>
			</AnimatePresence>
		</motion.div>
	);
};

export default FullScreenDialog;
