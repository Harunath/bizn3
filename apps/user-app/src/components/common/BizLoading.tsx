"use client";
import React from "react";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";

const BizLoading = () => {
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
						redirect("/login");
					}}
					className=" absolute inset-0 bg-white"
				/>
			</div>
		</>
	);
};

export default BizLoading;
