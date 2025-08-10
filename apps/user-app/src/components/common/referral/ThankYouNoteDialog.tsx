"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { upsertThankYouNoteAction } from "../../../lib/action/referral/thankYouNoteActions";
import { ThankYouNoteBusinessType } from "@repo/db/client";

type Props = {
	referralId: string;
	existingNote?: {
		amount: string;
		comment: string;
		businessType: ThankYouNoteBusinessType;
	};
};

export function ThankYouNoteDialog({ referralId, existingNote }: Props) {
	const [open, setOpen] = useState(false);
	const [amount, setAmount] = useState("");
	const [comment, setComment] = useState("");
	const [businessType, setBusinessType] =
		useState<ThankYouNoteBusinessType>("NEW");

	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		if (open && existingNote) {
			setAmount(existingNote.amount);
			setComment(existingNote.comment);
			setBusinessType(existingNote.businessType);
		}
	}, [open, existingNote]);

	const handleSubmit = () => {
		startTransition(() => {
			upsertThankYouNoteAction({
				referralId,
				amount,
				comment,
				businessType,
			}).then(() => setOpen(false));
		});
	};

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="px-4 py-2 text-sm font-medium border rounded hover:bg-gray-100 transition">
				{existingNote ? "Edit Thank You Note" : "Add Thank You Note"}
			</button>

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
						<motion.div
							initial={{ y: 50, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: 50, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
							<h2 className="text-xl font-semibold mb-4">
								{existingNote ? "Update" : "Create"} Thank You Note
							</h2>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-1">
										Amount
									</label>
									<input
										type="text"
										value={amount}
										onChange={(e) => setAmount(e.target.value)}
										className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-1">
										Business Type
									</label>
									<select
										value={businessType}
										onChange={(e) =>
											setBusinessType(
												e.target.value as ThankYouNoteBusinessType
											)
										}
										className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
										<option value="NEW">New</option>
										<option value="REPEAT">Repeat</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium mb-1">
										Comment
									</label>
									<textarea
										value={comment}
										onChange={(e) => setComment(e.target.value)}
										rows={3}
										className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div className="flex justify-end gap-2">
									<button
										onClick={() => setOpen(false)}
										className="px-4 py-2 border rounded hover:bg-gray-100 transition text-sm">
										Cancel
									</button>
									<button
										disabled={isPending}
										onClick={handleSubmit}
										className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
										{existingNote ? "Update" : "Submit"}
									</button>
								</div>
							</div>

							{/* Close button top-right */}
							<button
								onClick={() => setOpen(false)}
								className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
								✕
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
