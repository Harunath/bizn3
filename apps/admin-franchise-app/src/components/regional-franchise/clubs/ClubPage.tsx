"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import LoadingAnimation from "../../common/LoadingAnimation";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { usePathname } from "next/navigation";

type SortDir = "asc" | "desc";

import {
	ClubDetail,
	ClubDetailResponseSchema,
	ClubUser,
} from "../../../lib/zod/club"; // adjust path if needed
import Image from "next/image";
const ClubPage = ({ clubId }: { clubId: string }) => {
	const [club, setClub] = useState<ClubDetail | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const [q, setQ] = useState<string>("");
	const [sortDir, setSortDir] = useState<SortDir>("asc");
	const pathname = usePathname();

	useEffect(() => {
		void getClub();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clubId]);

	const getClub = async () => {
		setLoading(true);
		try {
			const res = await fetch(`/api/regional-franchise/clubs/${clubId}`);
			if (!res.ok) {
				toast.error("Failed to load club");
				return;
			}
			const json = await res.json();
			const parsed = ClubDetailResponseSchema.safeParse(json);
			if (!parsed.success) {
				console.error(parsed.error.format());
				toast.error("Unexpected response for club");
				return;
			}
			setClub(parsed.data.data);
		} catch (e) {
			console.error("[FETCH_CLUB]", e);
			toast.error("Something went wrong while loading club");
		} finally {
			setLoading(false);
		}
	};
	// Safe name extractor for flexible User shapes
	// Name helper (no Partial)
	const userName = (u: ClubUser) => {
		const first = u.firstname?.trim() ?? "";
		const last = u.lastname?.trim() ?? "";
		const full = [first, last].filter(Boolean).join(" ");
		return full || u.email || "Unknown";
	};
	type MemberFilter = "all" | "home" | "nonhome";
	const [filter, setFilter] = useState<MemberFilter>("all"); // default: all

	const visibleMembers = useMemo(() => {
		const members = club?.members ?? [];
		const home = club?.homeClubMembers ?? [];
		const homeIds = new Set(home.map((m) => m.id));

		// pick base set
		let base: ClubUser[] = [...members, ...home];
		if (filter === "home") base = home;
		else if (filter === "nonhome")
			base = members.filter((m) => !homeIds.has(m.id));
		// search
		const term = q.trim().toLowerCase();
		const filtered = term
			? base.filter((m) => userName(m).toLowerCase().includes(term))
			: base;

		// sort
		return [...filtered].sort((a, b) => {
			const A = userName(a).toLowerCase();
			const B = userName(b).toLowerCase();
			if (A < B) return sortDir === "asc" ? -1 : 1;
			if (A > B) return sortDir === "asc" ? 1 : -1;
			return 0;
		});
	}, [club?.members, club?.homeClubMembers, filter, q, sortDir]);

	if (loading) return <LoadingAnimation />;

	if (!club) {
		return (
			<div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
				<p className="text-sm text-gray-600">
					Club with id <span className="font-mono">{clubId}</span> not found.
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
					<li>
						{club.chapter ? (
							<Link
								href={`/regional-franchise/chapters/${club.chapter.id}`}
								className="hover:text-gray-700">
								{club.chapter.name}
							</Link>
						) : (
							<span className="text-gray-700">Unknown Chapter</span>
						)}
					</li>
					<li className="px-1">/</li>
					<li className="text-gray-800 font-medium">{club.name}</li>
				</ol>
			</nav>

			{/* Club header card */}
			<section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">
							{club.name}
						</h1>
						<p className="mt-1 text-sm text-gray-500">
							Chapter:{" "}
							{club.chapter ? (
								<Link
									href={`/regional-franchise/chapters/${club.chapter.id}`}
									className="font-medium text-gray-700 underline decoration-dotted underline-offset-2">
									{club.chapter.name}
								</Link>
							) : (
								<span className="font-mono">{club.chapterId}</span>
							)}
						</p>

						{/* Meta badges */}
						<div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
							<span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1">
								Code: {club.code}
							</span>
							<span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1">
								Members: {club.members?.length ?? 0}
							</span>
							<span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1">
								Home-club: {club.homeClubMembers?.length ?? 0}
							</span>
							{/* <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1">
								Leaders: {club.clubLeaders?.length ?? 0}
							</span>
							<span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1">
								Events: {club.clubEvents?.length ?? 0}
							</span> */}
							<span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1">
								Updated: {new Date(club.updatedAt).toLocaleDateString()}
							</span>
						</div>

						{/* Description */}
						{club.description ? (
							<p className="mt-4 max-w-3xl text-sm text-gray-700">
								{club.description}
							</p>
						) : null}
					</div>

					{/* Banner image (first) */}
					{Array.isArray(club.images) && club.images.length > 0 ? (
						<div className="ml-auto w-full max-w-xs overflow-hidden rounded-xl border border-gray-100">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={club.images[0]}
								alt={`${club.name} banner`}
								className="h-40 w-full object-cover"
							/>
						</div>
					) : null}
				</div>
			</section>

			{/* Members controls */}
			<section className="space-y-4">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h2 className="text-xl font-semibold tracking-tight">Members</h2>
						<p className="text-sm text-gray-500">
							{visibleMembers.length} result
							{visibleMembers.length !== 1 ? "s" : ""} · max 50
						</p>
					</div>

					<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
						{/* Filter: All | Home | Non-home */}
						<div className="flex items-center gap-2">
							<div className="inline-flex rounded-xl border border-gray-200 bg-white p-1">
								<label className="cursor-pointer">
									<input
										type="radio"
										name="memberFilter"
										value="all"
										checked={filter === "all"}
										onChange={() => setFilter("all")}
										className="peer sr-only"
									/>
									<span className="block rounded-lg px-3 py-1.5 text-sm text-gray-700 peer-checked:bg-red-600 peer-checked:text-white">
										All
									</span>
								</label>
								<label className="cursor-pointer">
									<input
										type="radio"
										name="memberFilter"
										value="home"
										checked={filter === "home"}
										onChange={() => setFilter("home")}
										className="peer sr-only"
									/>
									<span className="block rounded-lg px-3 py-1.5 text-sm text-gray-700 peer-checked:bg-red-600 peer-checked:text-white">
										Home-club
									</span>
								</label>
								<label className="cursor-pointer">
									<input
										type="radio"
										name="memberFilter"
										value="nonhome"
										checked={filter === "nonhome"}
										onChange={() => setFilter("nonhome")}
										className="peer sr-only"
									/>
									<span className="block rounded-lg px-3 py-1.5 text-sm text-gray-700 peer-checked:bg-red-600 peer-checked:text-white">
										Non-home
									</span>
								</label>
							</div>
						</div>

						{/* Search */}
						<div className="relative">
							<input
								value={q}
								onChange={(e) => setQ(e.target.value)}
								placeholder="Search members by name…"
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

				{/* Members grid */}
				{visibleMembers.length > 0 ? (
					<ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
						{visibleMembers.map((m) => {
							const name = userName(m);
							const email = m.email ?? undefined;

							return (
								<li key={m.id} className="group">
									<Link
										href={`${pathname}/${m.id}`}
										className="flex gap-x-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition group-hover:shadow-md">
										<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg font-medium text-gray-600">
											{m.profileImage ? (
												<Image
													src={m.profileImage}
													alt={name}
													width={40}
													height={40}
													className="rounded-full"
												/>
											) : (
												<CgProfile className="h-10 w-10" />
											)}
										</div>
										<div>
											<div className="flex items-start justify-between">
												<h3 className="text-lg font-semibold tracking-tight">
													{name}
												</h3>
												{/* If you want to show role, add it to Zod + API and then render it here. */}
											</div>

											{email ? (
												<p className="mt-1 text-sm text-gray-600">{email}</p>
											) : null}

											<div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
												<span className="rounded-md bg-gray-50 px-2 py-1">
													ID: {m.id}
												</span>
											</div>
											<div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
												<span className="rounded-md bg-gray-50 px-2 py-1">
													homeClubId: {m.id}
												</span>
											</div>
										</div>
									</Link>
								</li>
							);
						})}
					</ul>
				) : (
					<div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
						<p className="text-sm text-gray-600">
							{q ? "No members match your search." : "No members in this view."}
						</p>
					</div>
				)}
			</section>

			{/* Leaders */}
			{/* <section className="space-y-3">
				<h2 className="text-xl font-semibold tracking-tight">Leaders</h2>
				{club.clubLeaders?.length ? (
					<ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
						{club.clubLeaders.map((l) => (
							<li
								key={l.id}
								className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
								<div className="flex items-start justify-between">
									<h3 className="text-base font-semibold">
										{(l as any).name ??
											(l as any).displayName ??
											`Leader ${l.id.slice(0, 6)}`}
									</h3>
									<span className="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600">
										Leader
									</span>
								</div>
								{(l as any).email ? (
									<p className="mt-1 text-sm text-gray-600">
										{(l as any).email}
									</p>
								) : null}
							</li>
						))}
					</ul>
				) : (
					<p className="text-sm text-gray-600">No leaders added yet.</p>
				)}
			</section> */}

			{/* Events */}
			{/* <section className="space-y-3">
				<h2 className="text-xl font-semibold tracking-tight">Events</h2>
				{club.clubEvents?.length ? (
					<ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
						{club.clubEvents.map((e) => (
							<li
								key={e.id}
								className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
								<div className="flex items-start justify-between">
									<h3 className="text-base font-semibold">
										{(e as any).title ?? `Event ${e.id.slice(0, 6)}`}
									</h3>
									<span className="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600">
										{new Date(e.updatedAt).toLocaleDateString()}
									</span>
								</div>
								{(e as any).description ? (
									<p className="mt-2 line-clamp-2 text-sm text-gray-600">
										{(e as any).description}
									</p>
								) : null}
							</li>
						))}
					</ul>
				) : (
					<p className="text-sm text-gray-600">No events yet.</p>
				)}
			</section> */}
		</div>
	);
};

export default ClubPage;
