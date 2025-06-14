"use client";

import { useEffect, useState } from "react";
import { FiTrash } from "react-icons/fi";
import { ContactDetails } from "@repo/db/client";

interface ContactDetailsProps {
	userId: string;
	contactDetails: ContactDetails;
}

export default function ContactDetailsComp({
	userId,
	contactDetails,
}: ContactDetailsProps) {
	const [address, setAddress] = useState("");
	const [phone, setPhone] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [homeNumber, setHomeNumber] = useState("");
	const [pager, setPager] = useState("");
	const [voiceMail, setVoiceMail] = useState("");
	const [website, setWebsite] = useState<string>("");
	const [socialLinks, setSocialLinks] = useState<string[]>([]);

	useEffect(() => {
		if (contactDetails) {
			setAddress(JSON.stringify(contactDetails.billingAddress));
			setPhone(contactDetails.phone || "");
			setMobileNumber(contactDetails.mobile || "");
			setHomeNumber(contactDetails.houseNo || "");
			setPager(contactDetails.pager || "");
			setVoiceMail(contactDetails.voiceMail || "");
			setWebsite(contactDetails.website || "");
			setSocialLinks(contactDetails.links || []);
		}
	}, []);
	const handleAddSocialLink = () => {
		setSocialLinks([...(socialLinks ?? []), ""]);
	};

	const handleSocialChange = (index: number, value: string) => {
		const newLinks = [...(socialLinks ?? [])];
		newLinks[index] = value;
		setSocialLinks(newLinks);
	};

	const handleDeleteSocialLink = (index: number) => {
		setSocialLinks((prev = []) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const dataToSend = {
			billingAddress: address,
			phone,
			mobileNumber,
			homeNumber,
			pager,
			voiceMail,
			website,
			socialLinks: (socialLinks ?? []).filter((link) => link.trim() !== ""),
		};

		try {
			const response = await fetch(
				`/api/user/${userId}/my-profile/contact-details`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(dataToSend),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to save contact details");
			}

			alert("Contact details saved successfully!");
			// Optional: Reset form or update UI here
		} catch (error) {
			alert(`Error: ${(error as Error).message}`);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-5xl bg-white p-8 rounded-lg shadow space-y-6">
				{/* Full Name */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Name and Address
					</label>
					<input
						type="text"
						value={address || ""}
						onChange={(e) => setAddress(e.target.value)}
						placeholder="Enter Full Name"
						className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Phone Numbers */}
				<div className="grid grid-cols-2 gap-6">
					<div>
						<label className="block font-semibold text-black mb-1">
							Phone<span className="text-red-600">*</span>
						</label>
						<input
							type="tel"
							value={phone || ""}
							onChange={(e) => setPhone(e.target.value)}
							placeholder="Enter Phone Number"
							className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
							required
						/>
					</div>
					<div>
						<label className="block font-semibold text-black mb-1">
							Mobile Number
						</label>
						<input
							type="tel"
							value={mobileNumber || ""}
							onChange={(e) => setMobileNumber(e.target.value)}
							placeholder="Enter Mobile Number"
							className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
						/>
					</div>
					<div>
						<label className="block font-semibold text-black mb-1">Home</label>
						<input
							type="text"
							value={homeNumber || ""}
							onChange={(e) => setHomeNumber(e.target.value)}
							placeholder="Enter Home Number"
							className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
						/>
					</div>
					<div>
						<label className="block font-semibold text-black mb-1">Pager</label>
						<input
							type="text"
							value={pager || ""}
							onChange={(e) => setPager(e.target.value)}
							placeholder="Enter Pager Details"
							className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
						/>
					</div>
					<div>
						<label className="block font-semibold text-black mb-1">
							Voice Mail
						</label>
						<input
							type="text"
							value={voiceMail || ""}
							onChange={(e) => setVoiceMail(e.target.value)}
							placeholder="Enter Voice Mail"
							className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
						/>
					</div>
				</div>

				{/* Website */}
				<div>
					<label className="block font-semibold text-black mb-1">Website</label>
					<input
						type="url"
						value={website || ""}
						onChange={(e) => setWebsite(e.target.value)}
						placeholder="Enter Website URL"
						className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Social Media Links */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Social Networking Links
					</label>

					{(socialLinks ?? []).map((link, index) => (
						<div key={index} className="flex items-center mb-3 gap-3">
							<input
								type="url"
								placeholder={`Social Link ${index + 1}`}
								value={link}
								onChange={(e) => handleSocialChange(index, e.target.value)}
								className="flex-1 border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
							/>
							<button
								type="button"
								onClick={() => handleDeleteSocialLink(index)}
								className="text-red-600 hover:text-red-700 text-xl p-2 rounded hover:bg-red-100 transition"
								title="Delete link"
								aria-label={`Delete Social Link ${index + 1}`}>
								<FiTrash />
							</button>
						</div>
					))}

					<button
						type="button"
						onClick={handleAddSocialLink}
						className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
						+ Add Social Link
					</button>
				</div>

				{/* Actions */}
				<div className="flex justify-end gap-4 pt-6">
					<button
						type="submit"
						className="bg-black text-white px-6 py-2 rounded hover:opacity-90 font-semibold">
						Save
					</button>
				</div>
			</form>
		</div>
	);
}
