"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

// --- Types you can reuse across app ---
export type ProfileResult = {
	id: string;
	firstName: string;
	lastName: string;
	businessName?: string | null;
	avatarUrl?: string | null;
	category?: string | null;
	businessType?: string | null;
	keywords?: string[] | null;
	city?: string | null;
	state?: string | null;
	country?: string | null;
	headline?: string | null;
	isVip: boolean; // enforced by backend; UI shows badge
};

export type SearchFilters = {
	q: string; // name (first/last) or free text
	category: string;
	businessType: string;
	keywords: string; // comma/space separated
	location: string; // free text for city/state/country
	sortBy: "relevance" | "recent" | "name";
	page: number;
	pageSize: number;
};

// --- Constants (replace with server-provided options) ---
const CATEGORY_OPTIONS = [
	"",
	"Technology",
	"Finance",
	"Healthcare",
	"Real Estate",
	"Hospitality",
	"Education",
];
const BUSINESS_TYPE_OPTIONS = [
	"",
	"B2B",
	"B2C",
	"Services",
	"Manufacturing",
	"Retail",
];
const PAGE_SIZES = [10, 20, 50];

// --- Utility ---
function classNames(...s: Array<string | false | null | undefined>) {
	return s.filter(Boolean).join(" ");
}

function useDebounced<T>(value: T, delay = 400) {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const id = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(id);
	}, [value, delay]);
	return debounced;
}

// --- Main Component ---
export default function VipProfileSearchPage() {
	const [filters, setFilters] = useState<SearchFilters>({
		q: "",
		category: "",
		businessType: "",
		keywords: "",
		location: "",
		sortBy: "relevance",
		page: 1,
		pageSize: 20,
	});
	const debounced = useDebounced(filters, 400);

	const [results, setResults] = useState<ProfileResult[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Persist a request abort controller to cancel stale requests
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => {
		const fetchProfiles = async () => {
			setLoading(true);
			setError(null);
			abortRef.current?.abort();
			const ac = new AbortController();
			abortRef.current = ac;
			try {
				const params = new URLSearchParams({
					q: debounced.q,
					category: debounced.category,
					businessType: debounced.businessType,
					keywords: debounced.keywords,
					location: debounced.location,
					sortBy: debounced.sortBy,
					page: String(debounced.page),
					pageSize: String(debounced.pageSize),
					vipOnly: "true", // enforce VIP-only at API too
				});
				const res = await fetch(`/api/search/profiles?${params.toString()}`, {
					method: "GET",
					signal: ac.signal,
				});
				if (!res.ok) throw new Error(`Request failed: ${res.status}`);
				const data = (await res.json()) as {
					data: ProfileResult[];
					total: number;
				};
				setResults(data.data);
				setTotal(data.total);
			} catch (err) {
				if (err instanceof Error) {
					if (err?.name !== "AbortError")
						setError(err.message || "Something went wrong");
				} else {
					setError("Unknown error");
				}
			} finally {
				setLoading(false);
			}
		};
		fetchProfiles();
	}, [debounced]);

	const totalPages = useMemo(
		() => Math.max(1, Math.ceil(total / filters.pageSize)),
		[total, filters.pageSize]
	);

	const update = (patch: Partial<SearchFilters>) => {
		setFilters((f) => ({ ...f, page: patch.page ? patch.page : 1, ...patch }));
	};

	return (
		<div className="min-h-screen bg-white text-gray-900">
			{/* Page Header */}
			<header className="sticky top-0 z-20 border-b border-gray-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
				<div className="mx-auto max-w-7xl px-4 py-4">
					<div className="flex items-center justify-between gap-4">
						<h1 className="text-xl font-semibold tracking-tight text-red-600">
							VIP Member Search
						</h1>
						<VipBadge />
					</div>
				</div>
			</header>

			{/* Search & Filters */}
			<section className="mx-auto max-w-7xl px-4 py-6">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-12">
					{/* Search Bar */}
					<div className="md:col-span-6">
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Name / Free Text
						</label>
						<div className="relative">
							<input
								type="text"
								value={filters.q}
								onChange={(e) => update({ q: e.target.value })}
								placeholder="Search by first or last name, company, headline..."
								className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 pr-10 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
							/>
							<svg
								className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round">
								<circle cx="11" cy="11" r="8"></circle>
								<path d="m21 21-4.3-4.3"></path>
							</svg>
						</div>
					</div>

					{/* Category */}
					<div className="md:col-span-3">
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Category
						</label>
						<select
							value={filters.category}
							onChange={(e) => update({ category: e.target.value })}
							className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100">
							{CATEGORY_OPTIONS.map((opt) => (
								<option key={opt} value={opt}>
									{opt || "All"}
								</option>
							))}
						</select>
					</div>

					{/* Business Type */}
					<div className="md:col-span-3">
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Business Type
						</label>
						<select
							value={filters.businessType}
							onChange={(e) => update({ businessType: e.target.value })}
							className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100">
							{BUSINESS_TYPE_OPTIONS.map((opt) => (
								<option key={opt} value={opt}>
									{opt || "All"}
								</option>
							))}
						</select>
					</div>

					{/* Keywords */}
					<div className="md:col-span-6">
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Keywords
						</label>
						<input
							type="text"
							value={filters.keywords}
							onChange={(e) => update({ keywords: e.target.value })}
							placeholder="marketing, seo, exports (comma or space separated)"
							className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
						/>
					</div>

					{/* Location */}
					<div className="md:col-span-3">
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Location
						</label>
						<input
							type="text"
							value={filters.location}
							onChange={(e) => update({ location: e.target.value })}
							placeholder="City / State / Country"
							className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
						/>
					</div>

					{/* Sort */}
					<div className="md:col-span-3">
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Sort
						</label>
						<select
							value={filters.sortBy}
							onChange={(e) =>
								update({ sortBy: e.target.value as SearchFilters["sortBy"] })
							}
							className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100">
							<option value="relevance">Relevance</option>
							<option value="recent">Recently joined</option>
							<option value="name">Name A→Z</option>
						</select>
					</div>
				</div>

				{/* Toolbar */}
				<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
					<div className="text-sm text-gray-600">
						{loading
							? "Searching…"
							: total > 0
								? `${total} result${total === 1 ? "" : "s"}`
								: "No results yet"}
					</div>
					<div className="flex items-center gap-2">
						<label className="text-sm text-gray-600">Page size</label>
						<select
							value={filters.pageSize}
							onChange={(e) => update({ pageSize: Number(e.target.value) })}
							className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100">
							{PAGE_SIZES.map((s) => (
								<option key={s} value={s}>
									{s}
								</option>
							))}
						</select>
					</div>
				</div>
			</section>

			{/* Results */}
			<section className="mx-auto max-w-7xl px-4 pb-10">
				{error && (
					<div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{error}
					</div>
				)}
				{loading ? (
					<SkeletonGrid />
				) : results.length === 0 ? (
					<EmptyState />
				) : (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{results.map((p) => (
							<ProfileCard key={p.id} p={p} />
						))}
					</div>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="mt-6 flex items-center justify-center gap-2">
						<button
							onClick={() => update({ page: Math.max(1, filters.page - 1) })}
							disabled={filters.page === 1 || loading}
							className={classNames(
								"rounded-lg border px-3 py-1.5 text-sm",
								filters.page === 1 || loading
									? "cursor-not-allowed border-gray-200 text-gray-400"
									: "border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-600"
							)}>
							Prev
						</button>
						<span className="text-sm text-gray-600">
							Page {filters.page} / {totalPages}
						</span>
						<button
							onClick={() =>
								update({ page: Math.min(totalPages, filters.page + 1) })
							}
							disabled={filters.page >= totalPages || loading}
							className={classNames(
								"rounded-lg border px-3 py-1.5 text-sm",
								filters.page >= totalPages || loading
									? "cursor-not-allowed border-gray-200 text-gray-400"
									: "border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-600"
							)}>
							Next
						</button>
					</div>
				)}
			</section>
		</div>
	);
}

function VipBadge() {
	return (
		<div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="h-4 w-4">
				<path d="M12 2 2 7l10 5 10-5-10-5Zm0 7L2 4v13l10 5 10-5V4L12 9Z" />
			</svg>
			VIP Only
		</div>
	);
}

function ProfileCard({ p }: { p: ProfileResult }) {
	return (
		<article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
			<div className="flex items-start gap-3">
				<div className="relative h-14 w-14 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
					{p.avatarUrl ? (
						<Image
							src={p.avatarUrl}
							alt={`${p.firstName} ${p.lastName}`}
							fill
							className="object-cover"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center text-gray-400">
							<svg
								className="h-7 w-7"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5">
								<path d="M20 21a8 8 0 1 0-16 0" />
								<circle cx="12" cy="7" r="4" />
							</svg>
						</div>
					)}
					{p.isVip && (
						<span className="absolute -bottom-1 -right-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow">
							VIP
						</span>
					)}
				</div>
				<div className="min-w-0 flex-1">
					<h3 className="truncate text-sm font-semibold text-gray-900">
						{p.firstName} {p.lastName}
					</h3>
					{p.businessName && (
						<p className="truncate text-xs text-gray-600">{p.businessName}</p>
					)}
					{p.headline && (
						<p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
							{p.headline}
						</p>
					)}
					<div className="mt-2 flex flex-wrap items-center gap-2">
						{p.category && <Chip>{p.category}</Chip>}
						{p.businessType && <Chip>{p.businessType}</Chip>}
						{p.city && <Chip>{p.city}</Chip>}
					</div>
					{p.keywords?.length ? (
						<div className="mt-2 flex flex-wrap gap-1">
							{p.keywords.slice(0, 6).map((k, i) => (
								<span
									key={k + i}
									className="rounded-full border border-gray-200 px-2 py-0.5 text-[10px] text-gray-600">
									#{k}
								</span>
							))}
						</div>
					) : null}
				</div>
			</div>

			<div className="mt-4 flex items-center justify-between">
				<button className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-red-400 hover:text-red-600">
					View Profile
				</button>
				<button className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700">
					Connect
				</button>
			</div>

			<div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent transition group-hover:ring-red-200" />
		</article>
	);
}

function Chip({ children }: { children: React.ReactNode }) {
	return (
		<span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
			{children}
		</span>
	);
}

function SkeletonGrid() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4">
					<div className="flex items-start gap-3">
						<div className="h-14 w-14 rounded-full bg-gray-200" />
						<div className="flex-1">
							<div className="h-4 w-40 rounded bg-gray-200" />
							<div className="mt-2 h-3 w-28 rounded bg-gray-200" />
							<div className="mt-3 flex gap-2">
								<div className="h-5 w-16 rounded-full bg-gray-200" />
								<div className="h-5 w-16 rounded-full bg-gray-200" />
								<div className="h-5 w-12 rounded-full bg-gray-200" />
							</div>
						</div>
					</div>
					<div className="mt-4 flex gap-2">
						<div className="h-8 w-24 rounded-xl bg-gray-200" />
						<div className="h-8 w-24 rounded-xl bg-gray-200" />
					</div>
				</div>
			))}
		</div>
	);
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
			<svg
				className="mb-3 h-10 w-10 text-gray-400"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<path d="M3 7h18M3 12h18M3 17h18" />
			</svg>
			<p className="text-sm text-gray-600">
				Start by typing a name or selecting filters.
			</p>
		</div>
	);
}
