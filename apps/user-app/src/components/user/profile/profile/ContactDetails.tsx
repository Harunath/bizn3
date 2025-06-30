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
	const [website, setWebsite] = useState<string>("");
	const [socialLinks, setSocialLinks] = useState<string[]>([]);
	const [recordExists, setRecordExists] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		if (contactDetails) {
			try {
				const parsedAddress =
					typeof contactDetails.billingAddress === "string"
						? JSON.parse(contactDetails.billingAddress)
						: contactDetails.billingAddress;

				setAddress(
					parsedAddress !== undefined && parsedAddress !== null
						? String(parsedAddress)
						: ""
				);
			} catch {
				setAddress(
					contactDetails.billingAddress !== undefined &&
						contactDetails.billingAddress !== null
						? String(contactDetails.billingAddress)
						: ""
				);
			}

			setPhone(contactDetails.phone || "");
			setMobileNumber(contactDetails.mobile || "");
			setHomeNumber(contactDetails.houseNo || "");
			setWebsite(contactDetails.website || "");
			setSocialLinks(contactDetails.links || []);
			setRecordExists(true);
		}
	}, [contactDetails]);

	const handleAddSocialLink = () => {
		setSocialLinks((prev) => [...prev, ""]);
	};

	const handleSocialChange = (index: number, value: string) => {
		const updated = [...socialLinks];
		updated[index] = value;
		setSocialLinks(updated);
	};

	const handleDeleteSocialLink = (index: number) => {
		setSocialLinks((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		const payload = {
			billingAddress: address.trim(),
			phone,
			mobile: mobileNumber,
			houseNo: homeNumber,
			website,
			links: socialLinks.filter((link) => link.trim() !== ""),
		};

		try {
			const res = await fetch(
				`/api/user/${userId}/my-profile/contact-details`,
				{
					method: recordExists ? "PUT" : "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				}
			);

			const result = await res.json();

			if (!res.ok) {
				throw new Error(result.message || "Failed to save contact details.");
			}

			setMessage(
				recordExists ? "Updated successfully!" : "Saved successfully!"
			);
			setRecordExists(true);
		} catch (error) {
			setMessage(`Error: ${(error as Error).message}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex justify-center items-start p-4 md:p-6">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-5xl bg-slate-100 p-6 md:p-8  shadow-xl space-y-6">
				{/* Feedback */}
				{message && (
					<p
						className={`text-center font-semibold ${
							message.startsWith("Error") ? "text-red-600" : "text-green-600"
						}`}>
						{message}
					</p>
				)}

				{/* Name & Address */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Name and Address
					</label>
					<input
						type="text"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						placeholder="Enter full name and billing address"
						className="w-full bg-white border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Phone Fields */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block font-semibold text-black mb-1">
							Phone<span className="text-red-600">*</span>
						</label>
						<input
							type="tel"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							required
							placeholder="Enter Phone Number"
							className="w-full border bg-white border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
						/>
					</div>
					<div>
						<label className="block font-semibold text-black mb-1">
							Mobile Number
						</label>
						<input
							type="tel"
							value={mobileNumber}
							onChange={(e) => setMobileNumber(e.target.value)}
							placeholder="Enter Mobile Number"
							className="w-full border bg-white border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
						/>
					</div>
				</div>

				{/* Home Number */}
				<div>
					<label className="block font-semibold text-black mb-1">Home</label>
					<input
						type="text"
						value={homeNumber}
						onChange={(e) => setHomeNumber(e.target.value)}
						placeholder="Enter Home Number"
						className="w-full bg-white border  border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Website */}
				<div>
					<label className="block font-semibold text-black mb-1">Website</label>
					<input
						type="url"
						value={website}
						onChange={(e) => setWebsite(e.target.value)}
						placeholder="Enter Website URL"
						className="w-full bg-white border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
					/>
				</div>

				{/* Social Links */}
				<div>
					<label className="block font-semibold text-black mb-1">
						Social Networking Links
					</label>

					{socialLinks.map((link, index) => (
						<div
							key={index}
							className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-3">
							<input
								type="url"
								placeholder={`Social Link ${index + 1}`}
								value={link}
								onChange={(e) => handleSocialChange(index, e.target.value)}
								className="w-full bg-white md:flex-1 border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
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

				{/* Submit Button */}
				<div className="flex justify-end pt-6">
					<button
						type="submit"
						disabled={loading}
						className="bg-red-600 text-white px-6 py-2 rounded hover:opacity-90 font-semibold disabled:opacity-50">
						{loading ? "Saving..." : recordExists ? "Update" : "Save"}
					</button>
				</div>
			</form>
		</div>
	);
}
