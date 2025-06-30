"use client";
import { PersonalDetails, TitleTypes } from "@repo/db/client";
import { useState, useEffect } from "react";

interface Props {
	userId: string;
	personalDetails: PersonalDetails;
}

export default function PersonalDetailsComp({
	userId,
	personalDetails,
}: Props) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [title, setTitle] = useState<TitleTypes | "">("");
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [gender, setGender] = useState<"Male" | "Female" | "">("");
	const [suffix, setSuffix] = useState<string>("");
	const [displayName, setDisplayName] = useState<string>("");
	const [recordExists, setRecordExists] = useState(false);

	useEffect(() => {
		if (personalDetails) {
			setTitle(personalDetails.title || "");
			setFirstName(personalDetails.firstname || "");
			setLastName(personalDetails.lastname || "");
			setGender((personalDetails.gender as "Male" | "Female") || "");
			setSuffix(personalDetails.suffix || "");
			setDisplayName(personalDetails.displayname || "");
			setRecordExists(true);
		}
	}, [personalDetails]);

	useEffect(() => {
		setDisplayName(`${firstName} ${lastName}`.trim());
	}, [firstName, lastName]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		const payload = {
			title: title ? title : undefined,
			firstname: firstName.trim(),
			lastname: lastName.trim(),
			gender: gender ? gender : undefined,
			suffix: (suffix ?? "").trim(),
			displayname: displayName.trim(),
		};

		try {
			const res = await fetch(
				`/api/user/${userId}/my-profile/personal-details`,
				{
					method: recordExists ? "PUT" : "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				}
			);
			const result = await res.json();
			if (!res.ok)
				throw new Error(result.message || "Failed to submit details");

			setSuccess(
				recordExists
					? "Personal details updated successfully!"
					: "Personal details created successfully!"
			);
			setRecordExists(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen  flex justify-center items-start  md:p-6">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-5xl bg-slate-100 p-6 md:p-8  shadow-xl">
				{loading && <p className="text-center text-red-600">Loading...</p>}
				{error && <p className="text-center text-red-600">{error}</p>}
				{success && <p className="text-center text-green-600">{success}</p>}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Left Column */}
					<div className="space-y-4">
						<div>
							<label htmlFor="title" className="block font-semibold mb-1">
								Title
							</label>
							<select
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value as TitleTypes)}
								className="w-full bg-white border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
								required
								disabled={loading}>
								<option value="">Select</option>
								<option value="None">None</option>
								<option value="Mr">Mr</option>
								<option value="Mrs">Mrs</option>
								<option value="Ms">Ms</option>
								<option value="Miss">Miss</option>
								<option value="Dr">Dr</option>
								<option value="Prof">Prof</option>
							</select>
						</div>

						<div>
							<label htmlFor="firstName" className="block font-semibold mb-1">
								First Name
							</label>
							<input
								id="firstName"
								type="text"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								className="w-full bg-white border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
								required
								disabled={loading}
							/>
						</div>

						<div>
							<label htmlFor="lastName" className="block font-semibold mb-1">
								Last Name
							</label>
							<input
								id="lastName"
								type="text"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								className="w-full bg-white border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
								required
								disabled={loading}
							/>
						</div>
					</div>

					{/* Right Column */}
					<div className="space-y-4">
						<div>
							<label className="block font-semibold mb-1">Gender</label>
							<div className="flex items-center gap-4">
								<label className="inline-flex items-center gap-2">
									<input
										type="radio"
										name="gender"
										value="Male"
										checked={gender === "Male"}
										onChange={() => setGender("Male")}
										className="accent-red-600"
										disabled={loading}
									/>
									Male
								</label>
								<label className="inline-flex items-center gap-2">
									<input
										type="radio"
										name="gender"
										value="Female"
										checked={gender === "Female"}
										onChange={() => setGender("Female")}
										className="accent-red-600"
										disabled={loading}
									/>
									Female
								</label>
							</div>
						</div>

						<div>
							<label htmlFor="suffix" className="block font-semibold mb-1">
								Suffix
							</label>
							<input
								id="suffix"
								type="text"
								value={suffix}
								onChange={(e) => setSuffix(e.target.value)}
								className="w-full bg-white border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
								disabled={loading}
							/>
						</div>

						<div>
							<label htmlFor="displayName" className="block font-semibold mb-1">
								Display Name
							</label>
							<input
								id="displayName"
								type="text"
								value={displayName}
								onChange={(e) => setDisplayName(e.target.value)}
								className="w-full bg-white border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
								disabled={loading}
							/>
						</div>
					</div>
				</div>

				{/* Submit */}
				<div className="mt-8 flex justify-center">
					<button
						type="submit"
						disabled={loading}
						className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 font-semibold disabled:opacity-50 transition">
						{recordExists ? "Update" : "Create"}
					</button>
				</div>
			</form>
		</div>
	);
}
