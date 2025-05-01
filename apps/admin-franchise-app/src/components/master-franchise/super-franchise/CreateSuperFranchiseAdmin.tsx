"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CreateSuperFranchiseAdmin() {
	const [franchises, setFranchises] = useState<
		{ id: string; businessName: string }[]
	>([]);
	const [form, setForm] = useState({
		franchiseId: "",
		email: "",
		firstName: "",
		lastName: "",
		password: "",
		phone: "",
		nomineeName: "",
		nomineeRelation: "",
		nomineeContact: "",
	});

	useEffect(() => {
		const fetchFranchises = async () => {
			const res = await fetch(
				"/api/master-franchise/super-franchise/available-super-franchise"
			);
			const data = await res.json();
			if (!data.franchises) {
				setFranchises([]);
			}
			setFranchises(data.franchises);
		};
		fetchFranchises();
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await fetch(
				"/api/master-franchise/super-franchise/super-franchise-admin",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(form),
				}
			);

			if (!res.ok) {
				const { error } = await res.json();
				toast.error(error || "Failed to create admin");
				return;
			}

			toast.success("Franchise admin created successfully!");
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-2xl space-y-6">
			<h2 className="text-3xl font-semibold text-center text-gray-800">
				Create Super Franchise Admin
			</h2>

			<div className="space-y-4">
				<div>
					<label
						htmlFor="franchiseId"
						className="block text-sm font-medium text-gray-700">
						Select Franchise
					</label>
					<select
						id="franchiseId"
						name="franchiseId"
						onChange={handleChange}
						required
						className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-300">
						<option value="">Select Franchise</option>
						{franchises &&
							franchises.length > 0 &&
							franchises.map((f) => (
								<option key={f.id} value={f.id}>
									{f.businessName}
								</option>
							))}
					</select>
				</div>

				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700">
						Email
					</label>
					<input
						id="email"
						name="email"
						onChange={handleChange}
						placeholder="Email"
						className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-300"
						required
					/>
				</div>

				<div>
					<label
						htmlFor="firstName"
						className="block text-sm font-medium text-gray-700">
						First Name
					</label>
					<input
						id="firstName"
						name="firstName"
						onChange={handleChange}
						placeholder="First Name"
						className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-300"
						required
					/>
				</div>

				<div>
					<label
						htmlFor="lastName"
						className="block text-sm font-medium text-gray-700">
						Last Name
					</label>
					<input
						id="lastName"
						name="lastName"
						onChange={handleChange}
						placeholder="Last Name"
						className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-300"
					/>
				</div>

				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						onChange={handleChange}
						placeholder="Password"
						className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-300"
						required
					/>
				</div>

				<div>
					<label
						htmlFor="phone"
						className="block text-sm font-medium text-gray-700">
						Phone
					</label>
					<input
						id="phone"
						name="phone"
						onChange={handleChange}
						placeholder="Phone"
						className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-300"
						required
					/>
				</div>

				<div>
					<label
						htmlFor="nomineeName"
						className="block text-sm font-medium text-gray-700">
						Nominee Name
					</label>
					<input
						id="nomineeName"
						name="nomineeName"
						onChange={handleChange}
						placeholder="Nominee Name"
						className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-300"
						required
					/>
				</div>

				<div>
					<label
						htmlFor="nomineeRelation"
						className="block text-sm font-medium text-gray-700">
						Nominee Relation
					</label>
					<input
						id="nomineeRelation"
						name="nomineeRelation"
						onChange={handleChange}
						placeholder="Nominee Relation"
						className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-300"
						required
					/>
				</div>

				<div>
					<label
						htmlFor="nomineeContact"
						className="block text-sm font-medium text-gray-700">
						Nominee Contact
					</label>
					<input
						id="nomineeContact"
						name="nomineeContact"
						onChange={handleChange}
						placeholder="Nominee Contact"
						className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-300"
						required
					/>
				</div>
			</div>

			<button
				type="submit"
				className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition duration-200">
				Create Admin
			</button>
		</form>
	);
}
