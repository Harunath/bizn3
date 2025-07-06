"use client";
import React from "react";
import Link from "next/link";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const plans = [
	{
		icon: "🔓",
		title: "Free Plan",
		subtitle: "Pitch Club Access",
		price: "Free",
		features: [
			{ text: "WhatsApp Community Access", included: true },
			{ text: "Attend Pitch Clubs (online/physical)", included: true },
			{ text: "Zero-Budget Networking", included: true },
			{ text: "Open Networking – No Category Lock", included: true },
			{ text: "No Exclusive Seat", included: false },
			{ text: "No Structured Referral System", included: false },
			{ text: "No Leadership Eligibility", included: false },
		],
		// No button/link needed
	},
	{
		icon: "🌟",
		title: "Gold Plan",
		subtitle: "Community Membership with Exclusive Seat",
		price: "₹5,000/year",
		features: [
			{ text: "All Free Plan Benefits", included: true },
			{ text: "Category-Locked Membership", included: true },
			{ text: "Access to Local Community Networking Meets", included: true },
			{ text: "Community Referral Sharing", included: true },
			{ text: "Member Listing on Community Roster", included: true },
			{ text: "Participate in Select Business Events", included: true },
			{
				text: "No Chapter Referral Tracker or Leadership Role",
				included: false,
			},
		],
		buttonText: "Join Gold",
		link: "/free/upgrade/gold",
	},
	{
		icon: "👑",
		title: "VIP Plan",
		subtitle: "Full Chapter Membership",
		price: "₹12,099/year",
		tag: "Best Value",
		features: [
			{ text: "All Plan Benefits", included: true },
			{ text: "Weekly Chapter Meetings", included: true },
			{ text: "Full Access to Referral Tracking System", included: true },
			{ text: "Leadership Role Eligibility", included: true },
			{ text: "Feature Presentations", included: true },
			{ text: "Premium Events & Recognition", included: true },
			{ text: "Strategic One-to-Ones & Group Business Meets", included: true },
		],
		buttonText: "Join VIP",
		link: "/free/upgrade/vip",
	},
];

export default function PlansPage() {
	return (
		<div className="py-12 px-4 max-w-7xl mx-auto">
			<h2 className="text-3xl font-bold text-center mb-10">Choose Your Plan</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{plans.map((plan, index) => (
					<div
						key={index}
						className="relative border-2 border-gray-200 shadow-md p-6 bg-slate-100 hover:shadow-2xl transition-all">
						{/* Tag */}
						{plan.tag && (
							<span
								className={`absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full text-white ${
									plan.tag === "Best Value" ? "bg-yellow-500" : "bg-green-500"
								}`}>
								{plan.tag}
							</span>
						)}

						{/* Header */}
						<div className="text-center mb-4">
							<div className="text-4xl mb-2">{plan.icon}</div>
							<h3 className="text-xl font-bold text-gray-800">{plan.title}</h3>
							<p className="text-sm text-gray-500">{plan.subtitle}</p>
							<p className="text-2xl font-semibold text-red-600 mt-2">
								{plan.price}
							</p>
						</div>

						{/* Features */}
						<ul className="space-y-3 text-sm mb-6">
							{plan.features.map((feature, idx) => (
								<li key={idx} className="flex items-start gap-2">
									{feature.included ? (
										<FaCheckCircle className="text-green-600 mt-0.5" />
									) : (
										<FaTimesCircle className="text-red-500 mt-0.5" />
									)}
									<span>{feature.text}</span>
								</li>
							))}
						</ul>

						{/* Button (only if available) */}
						{plan.link && (
							<Link
								href={plan.link}
								className="block text-center bg-red-600 text-white font-semibold rounded-full py-2 hover:bg-red-700 transition">
								{plan.buttonText}
							</Link>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
