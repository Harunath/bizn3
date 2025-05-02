"use client";
import React, { useEffect, useState } from "react";
import { Chapter } from "@repo/db/client";
import LoadingAnimation from "../../common/LoadingAnimation";
import { toast } from "react-toastify";
import Link from "next/link";

const Chapters = () => {
	const [chapters, setChapters] = useState<Chapter[] | null>();
	const [loading, setLoading] = useState<boolean>(false);
	useEffect(() => {
		getChapters();
	}, []);
	const getChapters = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/regional-franchise/chapters");
			console.log(res);
			if (!res.ok) {
				toast.error("failed to load Chapters");
				return;
			}
			const result = await res.json();

			if (result.message === "success" && result.data) {
				setChapters(result.data);
			}
		} catch (error) {
			console.error("[FETCH_FRANCHISES]", error);
		} finally {
			setLoading(false);
		}
	};
	if (loading) return <LoadingAnimation />;

	return (
		<div>
			{chapters && chapters.length > 0 ? (
				<div className="grid lg:grid-cols-2 gap-4">
					{chapters.map((chapter) => (
						<Link
							href={`/regional-franchise/chapters/${chapter.id}`}
							key={chapter.id}>
							<p>{chapter.name}</p>
							<p>{chapter.code}</p>
							<p>{chapter.regionId}</p>
						</Link>
					))}
				</div>
			) : (
				<div>No franchises found.</div>
			)}
		</div>
	);
};
export default Chapters;
