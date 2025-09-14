"use client";
import { Chapter, Club, Region } from "@repo/db/client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import LoadingAnimation from "../../common/LoadingAnimation";
import Link from "next/link";

type SortDir = "asc" | "desc";

interface ChapterType extends Chapter {
	clubs: Club[];
	region: Region | null;
}

const ChapterPage = ({ chapterId }: { chapterId: string }) => {
	const [chapter, setChapter] = useState<ChapterType | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	// Clubs UI state
	const [q, setQ] = useState<string>("");
	const [sortDir, setSortDir] = useState<SortDir>("asc");

	useEffect(() => {
		getChapter();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chapterId]);

	const getChapter = async () => {
		setLoading(true);
		try {
			const res = await fetch(`/api/regional-franchise/chapters/${chapterId}`);
			if (!res.ok) {
				toast.error("Failed to load chapter");
				return;
			}
			const result = await res.json();
			if (result?.message === "success" && result?.data) {
				setChapter(result.data as ChapterType);
			} else {
				toast.error("Unexpected response for chapter");
			}
		} catch (error) {
			console.error("[FETCH_CHAPTER]", error);
			toast.error("Something went wrong while loading chapter");
		} finally {
			setLoading(false);
		}
	};

	const filteredClubs = useMemo(() => {
		const term = q.trim().toLowerCase();
		const base = chapter?.clubs ?? [];
		const filtered = term
			? base.filter((c) => (c.name ?? "").toLowerCase().includes(term))
			: base;

		const sorted = [...filtered].sort((a, b) => {
			const A = (a.name ?? "").toLowerCase();
			const B = (b.name ?? "").toLowerCase();
			if (A < B) return sortDir === "asc" ? -1 : 1;
			if (A > B) return sortDir === "asc" ? 1 : -1;
			return 0;
		});

		return sorted;
	}, [chapter?.clubs, q, sortDir]);

	if (loading) return <LoadingAnimation />;

	if (!chapter) {
		return (
			<div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
				<p className="text-sm text-gray-600">
					Chapter with id <span className="font-mono">{chapterId}</span> is not
					found.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Breadcrumbs */}
			<nav aria-label="Breadcrumb" className="text-sm">
				<ol className="flex flex-wrap items-center gap-1 text-gray-500">
					<li>
						<Link
							href="/regional-franchise/chapters"
							className="hover:text-gray-700">
							Chapters
						</Link>
					</li>
					<li className="px-1">/</li>
					<li className="text-gray-800 font-medium">{chapter.name}</li>
				</ol>
			</nav>

			{/* Chapter header card */}
			<section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">
							{chapter.name}
						</h1>
						<p className="mt-1 text-sm text-gray-500">
							Region:{" "}
							{chapter.region?.name ? (
								<span className="font-medium text-gray-700">
									{chapter.region.name}
								</span>
							) : (
								<span className="font-mono">{chapter.regionId}</span>
							)}
						</p>

						{/* Meta badges */}
						<div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
							<span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1">
								Code: {chapter.code}
							</span>
							<span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1">
								Clubs: {chapter.clubs?.length ?? 0}
							</span>
							<span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1">
								Updated: {new Date(chapter.updatedAt).toLocaleDateString()}
							</span>
						</div>

						{/* Description */}
						{chapter.description ? (
							<p className="mt-4 max-w-3xl text-sm text-gray-700">
								{chapter.description}
							</p>
						) : null}
					</div>

					{/* Optional banner image (first image if available) */}
					{Array.isArray(chapter.images) && chapter.images.length > 0 ? (
						<div className="ml-auto w-full max-w-xs overflow-hidden rounded-xl border border-gray-100">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={chapter.images[0]}
								alt={`${chapter.name} banner`}
								className="h-40 w-full object-cover"
							/>
						</div>
					) : null}
				</div>
			</section>

			{/* Clubs controls */}
			<section className="space-y-4">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h2 className="text-xl font-semibold tracking-tight">Clubs</h2>
						<p className="text-sm text-gray-500">
							{filteredClubs.length} result
							{filteredClubs.length !== 1 ? "s" : ""} · max 50
						</p>
					</div>

					<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
						<div className="relative">
							<input
								value={q}
								onChange={(e) => setQ(e.target.value)}
								placeholder="Search clubs by name…"
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

						<div className="flex items-center gap-2">
							<label
								htmlFor="sort"
								className="text-xs font-medium text-gray-600">
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

				{/* Clubs grid */}
				{filteredClubs.length > 0 ? (
					<ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
						{filteredClubs.map((club) => (
							<li key={club.id}>
								<Link
									href={`/regional-franchise/clubs/${club.id}`}
									className="group block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
									<div className="flex items-start justify-between">
										<h3 className="text-lg font-semibold tracking-tight">
											{club.name ?? "Untitled Club"}
										</h3>
										{/* If you have a `code` on Club, show it; otherwise remove this badge */}
										{"code" in club && (club as Club).code ? (
											<span className="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600">
												{(club as Club).code}
											</span>
										) : null}
									</div>

									{/* Optional description preview if available */}
									{"description" in club && (club as Club).description ? (
										<p className="mt-2 line-clamp-2 text-sm text-gray-600">
											{(club as Club).description}
										</p>
									) : null}

									<div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
										<span className="rounded-md bg-gray-50 px-2 py-1">
											Updated: {new Date(club.updatedAt).toLocaleDateString()}
										</span>
									</div>

									<div className="mt-4 flex items-center gap-2 text-sm font-medium text-red-600">
										<span className="transition group-hover:translate-x-0.5">
											View club
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
							{q
								? "No clubs match your search."
								: "No clubs found in this chapter."}
						</p>
					</div>
				)}
			</section>
		</div>
	);
};

export default ChapterPage;
