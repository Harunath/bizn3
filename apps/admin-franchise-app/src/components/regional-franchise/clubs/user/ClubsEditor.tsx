"use client";
import { useEffect, useState } from "react";
import Card from "./Card";

type Club = {
	id: string;
	name: string;
	chapter?: { id: string; name: string } | null;
};

export default function ClubsEditor({
	userId,
	clubs,
	onChanged,
}: {
	userId: string;
	clubs: Club[];
	onChanged: () => void;
}) {
	const [q, setQ] = useState("");
	const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
	const [sel, setSel] = useState("");

	useEffect(() => {
		const url = new URL("/api/admin/lookups/clubs", window.location.origin);
		if (q) url.searchParams.set("q", q);
		fetch(url.toString())
			.then((r) => r.json())
			.then((d) => setOptions(d.items));
	}, [q]);

	async function add() {
		if (!sel) return;
		const res = await fetch(`/api/admin/users/${userId}/clubs`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ clubId: sel }),
		});
		if (res.ok) {
			setSel("");
			setQ("");
			onChanged();
		}
	}

	async function remove(clubId: string) {
		const res = await fetch(`/api/admin/users/${userId}/clubs`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ clubId }),
		});
		if (res.ok) onChanged();
	}

	return (
		<Card title="Clubs (memberships)">
			<div className="flex gap-3">
				<div className="grow space-y-2">
					<input
						placeholder="Search clubs…"
						value={q}
						onChange={(e) => setQ(e.target.value)}
						className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
					/>
					<select
						value={sel}
						onChange={(e) => setSel(e.target.value)}
						className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm">
						<option value="">— Select club to add —</option>
						{options.map((o) => (
							<option key={o.id} value={o.id}>
								{o.name}
							</option>
						))}
					</select>
				</div>
				<button
					onClick={add}
					className="h-10 shrink-0 self-end rounded-xl border px-3 text-sm hover:bg-zinc-50">
					Add
				</button>
			</div>

			<ul className="mt-4 divide-y divide-zinc-100">
				{clubs.length === 0 && (
					<li className="py-3 text-sm text-zinc-500">No club memberships.</li>
				)}
				{clubs.map((c) => (
					<li key={c.id} className="flex items-center justify-between py-3">
						<div>
							<div className="text-sm font-medium">{c.name}</div>
							{c.chapter?.name ? (
								<div className="text-xs text-zinc-500">
									Chapter: {c.chapter.name}
								</div>
							) : null}
						</div>
						<button
							onClick={() => remove(c.id)}
							className="rounded-lg border px-2 py-1 text-xs hover:bg-zinc-50">
							Remove
						</button>
					</li>
				))}
			</ul>
		</Card>
	);
}
