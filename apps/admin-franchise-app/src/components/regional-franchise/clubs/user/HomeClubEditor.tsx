"use client";
import { useMemo, useState } from "react";
import Card from "./Card";
import { toast } from "react-toastify";

type Item = {
	id: string;
	name: string;
	chapterId: string;
	counts?: { homeClubMembers: number };
};

export default function HomeClubEditor({
	userId,
	current,
	// chapterId,
	onChanged,
}: {
	userId: string;
	current: { id: string; name: string } | null;
	chapterId: string | null;
	onChanged: () => void;
}) {
	const [q, setQ] = useState("");
	const [club, setClub] = useState<Item>();

	const [sel, setSel] = useState<string>();
	const searchClub = async () => {
		if (!q) {
			toast.info("Please enter a Club id");
			return;
		}
		const res = await fetch(`/api/regional-franchise/clubs/${q}`);
		if (!res.ok) {
			toast.error("Club not found");
			return;
		}
		const data = await res.json();
		setClub(data.data);
		console.log("Found club:", club);
	};
	async function save() {
		if (!sel) return;
		const res = await fetch(`/api/user/${userId}/homeclub`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ clubId: sel }),
		});
		if (res.ok) onChanged();
	}

	const hint = useMemo(
		() =>
			sel
				? "On save, the user's home club will be updated to the selected club."
				: "Select a club to set as the user's home club.",
		[sel]
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
				</div>
				<button
					onClick={searchClub}
					className="h-10 shrink-0 self-end rounded-xl border px-3 text-sm hover:bg-zinc-50">
					Search
				</button>
			</div>
			{club && club.id ? (
				<div className="mt-4 flex items-center justify-between">
					<div>
						<p className="font-medium">{club.name}</p>
						<p className="text-xs text-zinc-500">ID: {club.id}</p>
						{club?.counts?.homeClubMembers && (
							<p className="text-xs text-zinc-500">
								Current members no. : {club?.counts?.homeClubMembers}
							</p>
						)}
					</div>
					<button
						onClick={() => setSel(club.id)}
						className="rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50">
						Select
					</button>
				</div>
			) : null}
			{sel ? (
				<div className="mt-4 flex items-center justify-between">
					<div>
						<p className="font-medium">Selected club ID: {sel}</p>
					</div>
					<button
						onClick={save}
						className="rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50">
						Save
					</button>
				</div>
			) : null}

			{current ? (
				<p className="mt-3 text-xs text-zinc-500">Current: {current.name}</p>
			) : null}
		</Card>
	);
}
