"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CreateFranchiseAdmin() {
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
			const res = await fetch("/api/admin/franchise/available-franchise");
			const data = await res.json();
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
			const res = await fetch("/api/admin/franchise/franchise-admin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

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
		<form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4">
			<h2 className="text-xl font-bold">Create Franchise Admin</h2>

			<select
				name="franchiseId"
				onChange={handleChange}
				required
				className="input">
				<option value="">Select Franchise</option>
				{franchises.length > 0 &&
					franchises.map((f) => (
						<option key={f.id} value={f.id}>
							{f.businessName}
						</option>
					))}
			</select>

			<input
				name="email"
				onChange={handleChange}
				placeholder="Email"
				className="input"
				required
			/>
			<input
				name="firstName"
				onChange={handleChange}
				placeholder="First Name"
				className="input"
				required
			/>
			<input
				name="lastName"
				onChange={handleChange}
				placeholder="Last Name"
				className="input"
			/>
			<input
				name="password"
				type="password"
				onChange={handleChange}
				placeholder="Password"
				className="input"
				required
			/>
			<input
				name="phone"
				onChange={handleChange}
				placeholder="Phone"
				className="input"
				required
			/>

			<input
				name="nomineeName"
				onChange={handleChange}
				placeholder="Nominee Name"
				className="input"
				required
			/>
			<input
				name="nomineeRelation"
				onChange={handleChange}
				placeholder="Nominee Relation"
				className="input"
				required
			/>
			<input
				name="nomineeContact"
				onChange={handleChange}
				placeholder="Nominee Contact"
				className="input"
				required
			/>

			<button type="submit" className="btn btn-primary w-full">
				Create Admin
			</button>
		</form>
	);
}
