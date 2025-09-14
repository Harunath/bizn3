"use client";
import { useEffect, useMemo, useState } from "react";
import Card from "./Card";

type Item = { id: string; name: string; chapterId: string };

export default function HomeClubEditor({
	userId,
	current,
	chapterId,
	onChanged,
}: {
	userId: string;
	current: { id: string; name: string } | null;
	chapterId: string | null;
	onChanged: () => void;
}) {
	const [q, setQ] = useState("");
	const [options, setOptions] = useState<Item[]>([]);
	const [sel, setSel] = useState(current?.id ?? "");

	useEffect(() => {
		const url = new URL("/api/admin/lookups/clubs", window.location.origin);
		if (chapterId) url.searchParams.set("chapterId", chapterId);
		if (q) url.searchParams.set("q", q);
		fetch(url.toString())
			.then((r) => r.json())
			.then((d) => setOptions(d.items));
	}, [q, chapterId]);

	async function save() {
		if (!sel) return;
		const res = await fetch(`/api/admin/users/${userId}/home-club`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ clubId: sel }),
		});
		if (res.ok) onChanged();
	}

	const hint = useMemo(
		() =>
			chapterId
				? "Filtered to user's chapter"
				: "Assign a chapter first to restrict options",
		[chapterId]
	);

	return (
		<Card title="Home club">
			<div className="mb-2 text-xs text-zinc-500">{hint}</div>
			<div className="flex gap-3">
				<div className="grow space-y-2">
					<input
						placeholder="Search…"
						value={q}
						onChange={(e) => setQ(e.target.value)}
						className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
					/>
					<select
						value={sel}
						onChange={(e) => setSel(e.target.value)}
						className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm">
						<option value="">— Select home club —</option>
						{options.map((o) => (
							<option key={o.id} value={o.id}>
								{o.name}
							</option>
						))}
					</select>
				</div>
				<button
					onClick={save}
					className="h-10 shrink-0 self-end rounded-xl border px-3 text-sm hover:bg-zinc-50">
					Save
				</button>
			</div>
			{current ? (
				<p className="mt-3 text-xs text-zinc-500">Current: {current.name}</p>
			) : null}
		</Card>
	);
}
