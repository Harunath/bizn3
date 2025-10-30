"use client";
import { UserMembershipType } from "@prisma/client";
import Card from "./Card";
import { useState } from "react";

export default function ProfileCard({
	user,
	onUpdated,
}: {
	user: {
		id: string;
		firstname?: string;
		lastname?: string;
		email?: string;
		phone?: string;
		membershipType?: string;
	};
	onUpdated: () => void;
}) {
	const [form, setForm] = useState({
		firstname: user.firstname ?? "",
		lastname: user.lastname ?? "",
		email: user.email ?? "",
		phone: user.phone ?? "",
		MembershipType: user.membershipType ?? "",
	});
	const [saving, setSaving] = useState(false);

	async function save() {
		setSaving(true);
		const res = await fetch(`/api/regional-franchise/${user.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});
		setSaving(false);
		if (res.ok) onUpdated();
	}

	return (
		<Card title="Profile">
			<div className="space-y-3">
				<L label="firstname">
					<I
						value={form.firstname}
						onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
					/>
				</L>
				<L label="Lastname">
					<I
						value={form.lastname}
						onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
					/>
				</L>
				<L label="Email">
					<I
						type="email"
						value={form.email}
						onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
					/>
				</L>
				<L label="Phone">
					<I
						value={form.phone}
						onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))}
					/>
				</L>
				<L label="Membership type">
					<select
						value={form.MembershipType}
						onChange={(e) =>
							setForm((v) => ({ ...v, MembershipType: e.target.value }))
						}
						className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200">
						<option value={UserMembershipType.FREE}>FREE</option>
						<option value={UserMembershipType.GOLD}>GOLD</option>
						<option value={UserMembershipType.VIP}>VIP</option>
					</select>
				</L>
				<button
					onClick={save}
					disabled={saving}
					className="inline-flex items-center rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50 disabled:opacity-50">
					{saving ? "Saving…" : "Save changes"}
				</button>
			</div>
		</Card>
	);
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<label className="block">
			<div className="mb-1 text-xs text-zinc-500">{label}</div>
			{children}
		</label>
	);
}
function I(props: React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			{...props}
			className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
		/>
	);
}
