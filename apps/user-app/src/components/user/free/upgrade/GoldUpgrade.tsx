"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Club } from "@repo/db/client";
import { CheckoutPage } from "@repo/ui/CheckoutPage";

const GoldUpgrade = () => {
	const [clubs, setClubs] = useState<Club[] | null>(null);
	const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [payment_session_id, setPayment_session_id] = useState<string | null>(
		null
	);

	useEffect(() => {
		getClubs();
	}, []);

	const getClubs = async () => {
		try {
			const response = await fetch("/api/free/upgrade/gold/available-clubs");
			if (!response.ok) {
				toast.error("Failed to fetch available clubs");
				setClubs(null);
				return;
			}
			const data = await response.json();
			setClubs(data.data.clubs);
		} catch {
			toast.error("Something went wrong");
			setClubs(null);
		}
	};

	const handleCheckboxChange = (clubId: string) => {
		if (selectedClubs.includes(clubId)) {
			setSelectedClubs((prev) => prev.filter((id) => id !== clubId));
		} else {
			if (selectedClubs.length >= 4) {
				toast.warn("You can only select up to 4 clubs");
				return;
			}
			setSelectedClubs((prev) => [...prev, clubId]);
		}
	};

	const confirmSelection = async () => {
		setIsSubmitting(true);
		try {
			const res = await fetch("/api/free/upgrade/gold/order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					clubs: selectedClubs,
				}),
			});
			const data = await res.json();
			if (res.ok) {
				toast.info("Redirecting to payment page");
				setPayment_session_id(data.payment_session_id);
			} else {
				toast.error(data.message || "Upgrade failed");
			}
		} catch {
			toast.error("Something went wrong");
		} finally {
			setIsSubmitting(false);
			setShowModal(false);
		}
	};

	if (payment_session_id)
		return <CheckoutPage sessionId={payment_session_id} />;

	if (!clubs || clubs.length === 0) return <div>0 clubs available</div>;

	const selectedClubNames = clubs
		.filter((club) => selectedClubs.includes(club.id))
		.map((club) => club.name);

	return (
		<div className="p-4">
			<h2 className="text-lg font-semibold mb-4">Select up to 4 Clubs</h2>
			<div className="space-y-2">
				{clubs.map((club) => (
					<label key={club.id} className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={selectedClubs.includes(club.id)}
							onChange={() => handleCheckboxChange(club.id)}
						/>
						<span>{club.name}</span>
					</label>
				))}
			</div>

			{selectedClubs.length === 4 && (
				<div className="mt-4">
					<button
						onClick={() => setShowModal(true)}
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
						Confirm Clubs
					</button>
				</div>
			)}

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
						<h3 className="text-xl font-bold mb-4">Confirm Your Selection</h3>
						<ul className="list-disc pl-5 mb-4 text-gray-700">
							{selectedClubNames.map((name) => (
								<li key={name}>{name}</li>
							))}
						</ul>
						<div className="flex justify-end space-x-4">
							<button
								onClick={() => setShowModal(false)}
								className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
								disabled={isSubmitting}>
								Edit
							</button>
							<button
								onClick={confirmSelection}
								className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
								disabled={isSubmitting}>
								{isSubmitting ? "Submitting..." : "Confirm"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default GoldUpgrade;
