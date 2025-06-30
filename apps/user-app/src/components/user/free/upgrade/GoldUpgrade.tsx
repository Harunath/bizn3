"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Club } from "@repo/db/client";
import { CheckoutPage } from "@repo/ui/CheckoutPage";

// Red loader while data loads
const Loader = () => (
	<div className="flex justify-center items-center py-12">
		<div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
	</div>
);

const GoldUpgrade = () => {
	const [clubs, setClubs] = useState<Club[] | null>(null);
	const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [loading, setLoading] = useState(true);
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
				setClubs([]);
			} else {
				const data = await response.json();
				setClubs(data.data.clubs || []);
			}
		} catch {
			toast.error("Something went wrong");
			setClubs([]);
		} finally {
			setLoading(false);
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
				body: JSON.stringify({ clubs: selectedClubs }),
			});
			const data = await res.json();
			if (res.ok) {
				toast.info("Redirecting to payment page...");
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
	if (loading) return <Loader />;
	if (!clubs || clubs.length === 0) {
		return (
			<div className="text-center text-red-600 font-medium py-6">
				No clubs available at the moment.
			</div>
		);
	}

	const selectedClubNames = clubs
		.filter((club) => selectedClubs.includes(club.id))
		.map((club) => club.name);

	return (
		<div className="p-6 bg-slate-100 shadow-2xl rounded-xl max-w-2xl mx-auto">
			<h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
				Select up to <span className="text-red-600">4 Clubs</span>
			</h2>

			<div className="space-y-3">
				{clubs.map((club) => (
					<label
						key={club.id}
						className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white hover:shadow transition-all cursor-pointer">
						<input
							type="checkbox"
							checked={selectedClubs.includes(club.id)}
							onChange={() => handleCheckboxChange(club.id)}
							className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
						/>
						<span className="text-gray-800 font-medium">{club.name}</span>
					</label>
				))}
			</div>

			{selectedClubs.length === 4 && (
				<div className="mt-6 text-center">
					<button
						onClick={() => setShowModal(true)}
						className="inline-block bg-red-600 text-white font-semibold px-6 py-2.5 rounded-full shadow hover:bg-red-700 transition">
						Confirm Clubs
					</button>
				</div>
			)}

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
						<h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
							Confirm Your Selection
						</h3>

						<ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
							{selectedClubNames.map((name) => (
								<li key={name}>{name}</li>
							))}
						</ul>

						<div className="flex justify-end space-x-3">
							<button
								onClick={() => setShowModal(false)}
								className="px-5 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
								disabled={isSubmitting}>
								Edit
							</button>
							<button
								onClick={confirmSelection}
								className="px-5 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition disabled:opacity-50"
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
