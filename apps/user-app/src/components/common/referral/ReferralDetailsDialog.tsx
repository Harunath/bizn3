"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReferralType } from "./GetReferrals";
import ReferralActionButtons from "./ReferralActionButtons";
import ReferralStatusUpdater from "./ReferralStatusUpdater";

export default function ReferralDetailsDialog({
	referral,
	trigger,
}: {
	referral: ReferralType;
	trigger: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return (
		<>
			<div onClick={openModal} className="cursor-pointer">
				{trigger}
			</div>

			<AnimatePresence>
				{isOpen && (
					<>
						{/* Overlay */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={closeModal}
							className="fixed inset-0 bg-black/40 z-40"
						/>

						{/* Dialog Panel */}
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.2 }}
							className="fixed z-50 inset-0 flex items-center justify-center p-4">
							<div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
								<h2 className="text-xl font-semibold text-gray-900 mb-4">
									Referral Details
								</h2>

								<div className="space-y-2 text-sm text-gray-700">
									<p>
										<b>Creator:</b> {referral.creator.firstname}{" "}
										{referral.creator.lastname}
									</p>
									<p>
										<b>Type:</b> {referral.type}
									</p>
									<p>
										<b>Phone:</b> {referral.phone || "Not provided"}
									</p>
									<p>
										<b>Email:</b> {referral.Email || "Not provided"}
									</p>
									{referral.businessDetails && (
										<p>
											<b>Business Details:</b> {referral.businessDetails}
										</p>
									)}
									{referral.comments && (
										<p>
											<b>Comments:</b> {referral.comments}
										</p>
									)}
									{referral.thirdPartyDetails && (
										<p>
											<b>Third Party:</b>{" "}
											{JSON.stringify(referral.thirdPartyDetails)}
										</p>
									)}
									<p>
										<b>Status:</b> {referral.status}
									</p>
								</div>

								<hr className="my-4" />

								{referral.status === "WAITING" && (
									<ReferralActionButtons id={referral.id} />
								)}

								{referral.status != "WAITING" &&
									referral.status != "REJECTED" && (
										<ReferralStatusUpdater referral={referral} />
									)}

								<div className="mt-6 flex justify-end">
									<button
										onClick={closeModal}
										className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md">
										Close
									</button>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
