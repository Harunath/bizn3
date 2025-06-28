"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserMembershipType } from "@repo/db/client";

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

export default function ReferralForm() {
	const [referralType, setReferralType] = useState<ReferralType>("SELF");
	const [receiverQuery, setReceiverQuery] = useState("");
	const [receiverOptions, setReceiverOptions] = useState<User[]>([]);
	const [selectedReceiver, setSelectedReceiver] = useState<User | null>(null);
	const [uri, setUri] = useState("");
	const router = useRouter();

	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "loading") return; // Wait until session is ready

		if (status === "unauthenticated") {
			unAuthorizedUser();
			router.push("/login");
			return;
		}
		if (session) {
			if (session.user) {
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
		const delayDebounce = setTimeout(() => {
			if (receiverQuery.length < 2) return;

			fetch(`/api/${uri}/referral/get-user`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ finder: receiverQuery }),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					setReceiverOptions(data.data || []);
					console.log("data", data.data);
				});
		}, 300);

		return () => clearTimeout(delayDebounce);
	}, [receiverQuery, uri]);

	const handleSubmit = async () => {
		if (!selectedReceiver?.id) {
			alert("Please select a receiver");
			return;
		}

		if (referralType === "THIRD_PARTY" && !thirdPartyDetails.name.trim()) {
			alert("Third party name is required");
			return;
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
			}),
		});

		setSubmitting(false);

		if (res.ok) {
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
			alert("Failed to create referral");
		}
	};

	return (
		<div className="max-w-xl mx-auto p-6 border rounded-md shadow-sm bg-white space-y-4">
			<h2 className="text-xl font-bold">Create Referral</h2>

			{/* Referral Type */}
			<div className="space-x-4">
				<label>
					<input
						type="radio"
						value="SELF"
						checked={referralType === "SELF"}
						onChange={() => setReferralType("SELF")}
					/>{" "}
					Self
				</label>
				<label>
					<input
						type="radio"
						value="THIRD_PARTY"
						checked={referralType === "THIRD_PARTY"}
						onChange={() => setReferralType("THIRD_PARTY")}
					/>{" "}
					Third Party
				</label>
			</div>

			{/* Receiver Search */}
			<div className="relative">
				<label className="block font-medium">Search Receiver</label>
				<input
					type="text"
					value={receiverQuery}
					onChange={(e) => {
						setReceiverQuery(e.target.value);
						setSelectedReceiver(null);
					}}
					placeholder="Enter name or email..."
					className="mt-1 w-full border rounded px-3 py-2"
				/>
				{receiverOptions.length > 0 && !selectedReceiver && (
					<ul className=" absolute top z-20 border mt-1 bg-white rounded shadow-sm max-h-40 overflow-y-auto">
						{receiverOptions.map((user) => (
							<li
								key={user.id}
								onClick={() => {
									setSelectedReceiver(user);
									setReceiverQuery(
										`${user.firstname + user.lastname} (${user.email})`
									);
									setReceiverOptions([]);
								}}
								className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
								{user.firstname + user.lastname} - {user.email} -{" "}
								{user.homeClub.name} - {user.homeClub.chapter.name}
							</li>
						))}
					</ul>
				)}
			</div>

			{/* Business Details */}
			<div>
				<label className="block font-medium">Business Details</label>
				<textarea
					value={businessDetails}
					onChange={(e) => setBusinessDetails(e.target.value)}
					className="w-full mt-1 border px-3 py-2 rounded"
				/>
			</div>

			{/* Phone & Email */}
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block font-medium">Phone</label>
					<input
						type="text"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						className="w-full mt-1 border px-3 py-2 rounded"
					/>
				</div>
				<div>
					<label className="block font-medium">Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full mt-1 border px-3 py-2 rounded"
					/>
				</div>
			</div>

			{/* Third Party Details */}
			{referralType === "THIRD_PARTY" && (
				<div className="border rounded p-4 bg-gray-50 space-y-3">
					<h3 className="font-semibold">Third Party Details</h3>
					<div>
						<label className="block font-medium">Name *</label>
						<input
							type="text"
							value={thirdPartyDetails.name}
							onChange={(e) =>
								setThirdPartyDetails({
									...thirdPartyDetails,
									name: e.target.value,
								})
							}
							className="w-full mt-1 border px-3 py-2 rounded"
							required
						/>
					</div>
					<div>
						<label className="block font-medium">Other Info</label>
						<textarea
							value={thirdPartyDetails.otherInfo}
							onChange={(e) =>
								setThirdPartyDetails({
									...thirdPartyDetails,
									otherInfo: e.target.value,
								})
							}
							className="w-full mt-1 border px-3 py-2 rounded"
						/>
					</div>
				</div>
			)}

			{/* Comments */}
			<div>
				<label className="block font-medium">Comments</label>
				<textarea
					value={comments}
					onChange={(e) => setComments(e.target.value)}
					className="w-full mt-1 border px-3 py-2 rounded"
				/>
			</div>

			{/* Submit Button */}
			<div className="flex justify-end">
				<button
					onClick={handleSubmit}
					disabled={submitting}
					className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
					{submitting ? "Submitting..." : "Create Referral"}
				</button>
			</div>

			{success && (
				<p className="text-green-600 font-medium text-center">
					Referral created successfully!
				</p>
			)}
		</div>
	);
}
