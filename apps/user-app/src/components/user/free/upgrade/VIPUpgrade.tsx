"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CheckoutPage } from "@repo/ui/CheckoutPage";

type BusinessCategory = {
	id: string;
	name: string;
};

const VIPUpgrade = () => {
	const [categories, setCategories] = useState<BusinessCategory[]>([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null
	);
	const [showModal, setShowModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [payment_session_id, setPayment_session_id] = useState<string | null>(
		null
	);

	useEffect(() => {
		getAvailableCategories();
	}, []);

	const getAvailableCategories = async () => {
		try {
			const res = await fetch("/api/free/upgrade/vip/available-categories");
			if (!res.ok) throw new Error("Failed to fetch");

			const data = await res.json();
			setCategories(data.data.availableCategories); // adjust based on API shape
		} catch {
			toast.error("Failed to fetch categories");
			setCategories([]);
		}
	};

	const handleSelectCategory = (categoryId: string) => {
		setSelectedCategoryId(categoryId);
		setShowModal(true);
	};

	const confirmUpgrade = async () => {
		if (!selectedCategoryId) return;

		setIsSubmitting(true);
		try {
			const res = await fetch("/api/free/upgrade/vip/order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					paymentId: "replace-me", // Replace with real payment ID
					categoryId: selectedCategoryId,
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

	return (
		<div className="p-4">
			<h2 className="text-lg font-semibold mb-4">
				Select One Business Category
			</h2>
			<div className="space-y-2">
				{categories.map((category) => (
					<label key={category.id} className="flex items-center gap-2">
						<input
							type="radio"
							name="category"
							checked={selectedCategoryId === category.id}
							onChange={() => handleSelectCategory(category.id)}
						/>
						<span>{category.name}</span>
					</label>
				))}
			</div>

			{/* Modal */}
			{showModal && selectedCategoryId && (
				<div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
						<h3 className="text-xl font-bold mb-4">Confirm VIP Upgrade</h3>
						<p className="text-gray-700 mb-4">
							You&apos;re about to request a VIP upgrade for the category:{" "}
							<span className="font-semibold">
								{categories.find((c) => c.id === selectedCategoryId)?.name}
							</span>
						</p>
						<div className="flex justify-end space-x-4">
							<button
								onClick={() => setShowModal(false)}
								className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
								disabled={isSubmitting}>
								Edit
							</button>
							<button
								onClick={confirmUpgrade}
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

export default VIPUpgrade;
