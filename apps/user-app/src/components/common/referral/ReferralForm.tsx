"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserMembershipType } from "@repo/db/client";
import { toast } from "react-toastify";

type ReferralType = "SELF" | "THIRD_PARTY";

interface User {
	id: string;
	firstname: string;
	lastname: string;
	email: string;
	homeClub: {
		name: string;
		chapter: {
			name: string;
		};
	};
}
type PriorityType = "LEVEL_1" | "LEVEL_2" | "LEVEL_3" | "LEVEL_4" | "LEVEL_5";

export default function ReferralForm() {
	const [referralType, setReferralType] = useState<ReferralType>("SELF");
	const [receiverQuery, setReceiverQuery] = useState("");
	const [receiverOptions, setReceiverOptions] = useState<User[]>([]);
	const [selectedReceiver, setSelectedReceiver] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [uri, setUri] = useState("");
	const router = useRouter();

	const { data: session, status } = useSession();
	const [priority, setPriority] = useState<PriorityType>("LEVEL_1");

	useEffect(() => {
		if (status === "loading") return;
		if (status === "unauthenticated") {
			unAuthorizedUser();
			router.push("/login");
			return;
		}
		if (session) {
			switch (session.user.membershipType) {
				case UserMembershipType.VIP:
					setUri("vip");
					break;
				case UserMembershipType.GOLD:
					setUri("gold");
					break;
				case UserMembershipType.FREE:
					setUri("free");
					break;
				default:
					unAuthorizedUser();
					router.push("/login");
			}
		}
	}, [status]);

	const unAuthorizedUser = async () => {
		await signOut();
	};

	const [businessDetails, setBusinessDetails] = useState("");
	const [comments, setComments] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");

	const [thirdPartyDetails, setThirdPartyDetails] = useState({
		name: "",
		otherInfo: "",
	});

	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);

	// 🔍 Search receiver from backend
	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const fetchUsers = async () => {
			if (receiverQuery.length < 2) return;

			setLoading(true);
			console.log("loading", true);

			try {
				const res = await fetch(`/api/${uri}/referral/get-user`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ finder: receiverQuery }),
					signal,
				});

				const data = await res.json();
				setReceiverOptions(data.data || []);
			} catch (error) {
				if (error instanceof Error && error.name !== "AbortError") {
					console.error("Fetch error:", error);
				} else console.error("Fetch error:", " unknown");
			} finally {
				setLoading(false);
				console.log("loading", false);
			}
		};

		const delayDebounce = setTimeout(() => {
			fetchUsers();
		}, 300);

		return () => {
			clearTimeout(delayDebounce);
			controller.abort();
		};
	}, [receiverQuery, uri]);

	const handleSubmit = async () => {
		if (!selectedReceiver?.id) return alert("Please select a receiver");
		if (referralType === "THIRD_PARTY" && !thirdPartyDetails.name.trim()) {
			return alert("Third party name is required");
		}

		setSubmitting(true);
		const res = await fetch(`/api/${uri}/referral`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				receiverId: selectedReceiver.id,
				type: referralType,
				businessDetails,
				phone,
				Email: email,
				comments,
				thirdPartyDetails:
					referralType === "THIRD_PARTY" ? thirdPartyDetails : undefined,
				priority: priority || "LEVEL_1",
			}),
		});

		setSubmitting(false);

		if (res.ok) {
			toast.success("Referral is sent successfully");
			setSuccess(true);
			// Reset form
			setReceiverQuery("");
			setSelectedReceiver(null);
			setBusinessDetails("");
			setPhone("");
			setEmail("");
			setComments("");
			setThirdPartyDetails({ name: "", otherInfo: "" });
		} else {
			toast.error("Failed to create referral");
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white space-y-6 my-10 border border-gray-200">
			<div className="text-center space-y-1">
				<h1 className="text-3xl font-bold tracking-tight text-black">
					<span className="text-red-600">Biz-</span>Network
					<sup className="text-xs align-top">®</sup> Referral Form
				</h1>

				<p className="text-sm text-black italic">
					(Be Sure To Announce This At The Meeting)
				</p>
			</div>

			{/* Referral Type */}
			<div className="flex gap-6 items-center">
				<label className="flex items-center gap-2">
					<input
						type="radio"
						value="SELF"
						checked={referralType === "SELF"}
						onChange={() => setReferralType("SELF")}
					/>
					<span className="text-sm font-medium">Self</span>
				</label>
				<label className="flex items-center gap-2">
					<input
						type="radio"
						value="THIRD_PARTY"
						checked={referralType === "THIRD_PARTY"}
						onChange={() => setReferralType("THIRD_PARTY")}
					/>
					<span className="text-sm font-medium">Third Party</span>
				</label>
			</div>

			{/* Receiver Search */}
			<div className="relative">
				<label className="block font-semibold text-sm mb-1">
					Search Receiver
				</label>
				<input
					type="text"
					value={receiverQuery}
					onChange={(e) => {
						setReceiverQuery(e.target.value);
						setSelectedReceiver(null);
					}}
					placeholder="Enter name or email..."
					className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-red-500"
				/>
				{!loading &&
					receiverQuery.length >= 2 &&
					receiverOptions.length == 0 &&
					!selectedReceiver && (
						<p className=" text-xs">No user found with {receiverQuery}</p>
					)}
				{((receiverOptions.length > 0 && !selectedReceiver) || loading) && (
					<ul className="absolute z-30 w-full bg-white border mt-1 rounded shadow max-h-40 overflow-y-auto">
						{loading && <p className="px-4 py-2">Loading...</p>}
						{receiverOptions.map((user) => (
							<li
								key={user.id}
								onClick={() => {
									setSelectedReceiver(user);
									setReceiverQuery(
										`${user.firstname + " " + user.lastname} (${user.email})`
									);
									setReceiverOptions([]);
								}}
								className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
								{user.firstname} {user.lastname} - {user.email} -{" "}
								{user.homeClub.name} - {user.homeClub.chapter.name}
							</li>
						))}
					</ul>
				)}
			</div>

			{/* Business Details */}
			<div>
				<label className="block font-semibold text-sm mb-1">
					Business Details
				</label>
				<textarea
					value={businessDetails}
					onChange={(e) => setBusinessDetails(e.target.value)}
					className="w-full border px-4 py-2 rounded resize-none focus:ring-2 focus:ring-red-500"
					rows={3}
				/>
			</div>

			{/* Phone & Email */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block font-semibold text-sm mb-1">Phone</label>
					<input
						type="text"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-red-500"
					/>
				</div>
				<div>
					<label className="block font-semibold text-sm mb-1">Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-red-500"
					/>
				</div>
			</div>

			{/* Third Party Details */}
			{referralType === "THIRD_PARTY" && (
				<div className="bg-gray-50 p-4 rounded border space-y-4">
					<h3 className="text-md font-semibold text-black">
						Third Party Details
					</h3>
					<div>
						<label className="block text-sm font-medium">Name *</label>
						<input
							type="text"
							value={thirdPartyDetails.name}
							onChange={(e) =>
								setThirdPartyDetails({
									...thirdPartyDetails,
									name: e.target.value,
								})
							}
							className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-red-500"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium">Other Info</label>
						<textarea
							value={thirdPartyDetails.otherInfo}
							onChange={(e) =>
								setThirdPartyDetails({
									...thirdPartyDetails,
									otherInfo: e.target.value,
								})
							}
							className="w-full border px-4 py-2 rounded resize-none focus:ring-2 focus:ring-red-500"
							rows={2}
						/>
					</div>
				</div>
			)}

			{/* Comments */}
			<div>
				<label className="block font-semibold text-sm mb-1">Comments</label>
				<textarea
					value={comments}
					onChange={(e) => setComments(e.target.value)}
					className="w-full border px-4 py-2 rounded resize-none focus:ring-2 focus:ring-red-500"
					rows={3}
				/>
			</div>
			{/* Priority Selector */}
			<div>
				<label className="block font-semibold text-sm mb-1">
					Priority Level <span className="text-red-500">*</span>
				</label>
				<select
					value={priority}
					onChange={(e) => setPriority(e.target.value as PriorityType)}
					className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-red-500"
					required>
					<option value="">-- Select Priority --</option>
					<option value="LEVEL_1">🔥 LEVEL 1 - Urgent</option>
					<option value="LEVEL_2">🔥 LEVEL 2 - High</option>
					<option value="LEVEL_3">🌤 LEVEL 3 - Medium</option>
					<option value="LEVEL_4">❄️ LEVEL 4 - Low</option>
					<option value="LEVEL_5">❄️ LEVEL 5 - Least</option>
				</select>
			</div>

			{/* Submit */}
			<div className="flex justify-end">
				<button
					onClick={handleSubmit}
					disabled={submitting}
					className="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition disabled:opacity-50">
					{submitting ? "Submitting..." : "Create Referral"}
				</button>
			</div>

			{success && (
				<p className="text-green-600 text-sm font-medium text-center">
					Referral created successfully!
				</p>
			)}
		</div>
	);
}
