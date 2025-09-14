"use client";
import React, { useEffect, useMemo, useState } from "react";
import LoadingAnimation from "../../common/LoadingAnimation";
import { toast } from "react-toastify";
import Link from "next/link";

type SortDir = "asc" | "desc";

interface ChaptersType {
	id: string;
	name: string;
	code: string;
	regionId: string;
	description: string | null;
	updatedAt: string;
	clubCount: string;
}

const Chapters = () => {
	const [chapters, setChapters] = useState<ChaptersType[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [q, setQ] = useState<string>("");
	const [sortDir, setSortDir] = useState<SortDir>("asc");

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/regional-franchise/chapters");
				if (!res.ok) {
					toast.error("Failed to load chapters");
					return;
				}
				const result = await res.json();
				if (result?.message === "success" && Array.isArray(result?.data)) {
					setChapters(result.data as ChaptersType[]);
				} else {
					toast.error("Unexpected response for chapters");
				}
			} catch (err) {
				console.error("[FETCH_CHAPTERS]", err);
				toast.error("Something went wrong while loading chapters");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const filtered = useMemo(() => {
		const term = q.trim().toLowerCase();
		const base = term
			? chapters.filter((c) => c.name.toLowerCase().includes(term))
			: chapters;

		const sorted = [...base].sort((a, b) => {
			const A = a.name.toLowerCase();
			const B = b.name.toLowerCase();
			if (A < B) return sortDir === "asc" ? -1 : 1;
			if (A > B) return sortDir === "asc" ? 1 : -1;
			return 0;
		});
		return sorted;
	}, [chapters, q, sortDir]);

	if (loading) return <LoadingAnimation />;

	return (
		<div className="space-y-6">
			{/* Header + Controls */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Chapters</h1>
					<p className="text-sm text-gray-500">
						{filtered.length} result{filtered.length !== 1 ? "s" : ""} · max 50
						chapters
					</p>
				</div>

				<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
					{/* Search */}
					<div className="relative">
						<input
							value={q}
							onChange={(e) => setQ(e.target.value)}
							placeholder="Search by name…"
							className="w-full sm:w-72 rounded-xl border border-gray-200 bg-white/70 px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-red-500/30"
						/>
						{q && (
							<button
								onClick={() => setQ("")}
								className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100">
								Clear
							</button>
						)}
					</div>

					{/* Sort */}
					<div className="flex items-center gap-2">
						<label htmlFor="sort" className="text-xs font-medium text-gray-600">
							Sort:
						</label>
						<select
							id="sort"
							value={sortDir}
							onChange={(e) => setSortDir(e.target.value as SortDir)}
							className="rounded-xl border border-gray-200 bg-white/70 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-red-500/30">
							<option value="asc">Name · A → Z</option>
							<option value="desc">Name · Z → A</option>
						</select>
					</div>
				</div>
			</div>

			{/* List */}
			{filtered.length > 0 ? (
				<ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					{filtered.map((chapter) => (
						<li key={chapter.id}>
							<Link
								href={`/regional-franchise/chapters/${chapter.id}`}
								className="group block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
								<div className="flex items-start justify-between">
									<h2 className="text-lg font-semibold tracking-tight">
										{chapter.name}
									</h2>
									{/* Code badge */}
									<span className="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600">
										{chapter.code}
									</span>
								</div>

								{/* Meta */}
								<div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
									<span className="rounded-md bg-gray-50 px-2 py-1">
										Region: {chapter.regionId.slice(0, 8)}…
									</span>
									<span className="rounded-md bg-gray-50 px-2 py-1">
										Clubs: {chapter.clubCount ? chapter.clubCount : 0}
									</span>
									<span className="rounded-md bg-gray-50 px-2 py-1">
										Updated: {new Date(chapter.updatedAt).toLocaleDateString()}
									</span>
								</div>

								{/* Description (optional) */}
								{chapter.description ? (
									<p className="mt-3 line-clamp-2 text-sm text-gray-600">
										{chapter.description}
									</p>
								) : null}

								{/* CTA */}
								<div className="mt-4 flex items-center gap-2 text-sm font-medium text-red-600">
									<span className="transition group-hover:translate-x-0.5">
										View details
									</span>
									<svg
										className="h-4 w-4 transition group-hover:translate-x-0.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden>
										<path strokeWidth="2" d="M9 5l7 7-7 7" />
									</svg>
								</div>
							</Link>
						</li>
					))}
				</ul>
			) : (
				<div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
					<p className="text-sm text-gray-600">
						{q ? "No chapters match your search." : "No chapters found."}
					</p>
				</div>
			)}
		</div>
	);
};

export default Chapters;
