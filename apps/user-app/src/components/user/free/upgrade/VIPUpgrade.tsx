"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CheckoutPage } from "@repo/ui/CheckoutPage";

// Red loader while data loads
const Loader = () => (
	<div className="flex justify-center items-center py-12">
		<div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
	</div>
);

type BusinessCategory = {
	id: string;
	name: string;
};

const VIPUpgrade = () => {
	const [categories, setCategories] = useState<BusinessCategory[]>([]);
	const [filtered, setFiltered] = useState<BusinessCategory[]>([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null
	);
	const [search, setSearch] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [loading, setLoading] = useState(true);
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
			setCategories(data.data.availableCategories);
			setFiltered(data.data.availableCategories);
		} catch {
			toast.error("Failed to fetch categories");
			setCategories([]);
			setFiltered([]);
		} finally {
			setLoading(false);
		}
	};

	// Regex-based filter
	useEffect(() => {
		const regex = new RegExp(search, "i");
		const result = categories.filter((cat) => regex.test(cat.name));
		setFiltered(result);
	}, [search, categories]);

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
					paymentId: "replace-me", // replace this if needed
					categoryId: selectedCategoryId,
				}),
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
	if (!categories.length) {
		return (
			<div className="text-center text-red-600 font-medium py-6">
				No categories available at the moment.
			</div>
		);
	}

	return (
		<div className="p-6 bg-slate-100 shadow-2xl rounded-xl max-w-2xl mx-auto">
			<h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
				Choose a <span className="text-red-600">Business Category</span>
			</h2>

			{/* Search Input */}
			<div className="mb-4">
				<input
					type="text"
					placeholder="Search categories..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
				/>
			</div>

			{/* Scrollable List */}
			<div className="max-h-64 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-red-300 scrollbar-track-gray-100">
				{filtered.map((category) => (
					<label
						key={category.id}
						className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white hover:shadow transition-all cursor-pointer">
						<input
							type="radio"
							name="category"
							checked={selectedCategoryId === category.id}
							onChange={() => handleSelectCategory(category.id)}
							className="w-5 h-5 text-red-600 focus:ring-red-500"
						/>
						<span className="text-gray-800 font-medium">{category.name}</span>
					</label>
				))}
				{filtered.length === 0 && (
					<p className="text-center text-gray-500">
						No matching categories found
					</p>
				)}
			</div>

			{/* Modal */}
			{showModal && selectedCategoryId && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
						<h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
							Confirm VIP Upgrade
						</h3>

						<p className="text-gray-700 mb-6 text-center">
							You&apos;re about to request a VIP upgrade for:
							<br />
							<span className="text-red-600 font-semibold block mt-2">
								{categories.find((c) => c.id === selectedCategoryId)?.name}
							</span>
						</p>

						<div className="flex justify-end space-x-3">
							<button
								onClick={() => setShowModal(false)}
								className="px-5 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
								disabled={isSubmitting}>
								Edit
							</button>
							<button
								onClick={confirmUpgrade}
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

export default VIPUpgrade;
