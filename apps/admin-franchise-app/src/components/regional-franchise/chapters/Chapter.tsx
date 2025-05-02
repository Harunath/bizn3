"use client";
import { Chapter, Club, Region } from "@repo/db/client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingAnimation from "../../common/LoadingAnimation";
import Clubs from "../clubs/Clubs";

interface ChapterType extends Chapter {
	clubs: Club[];
	region: Region;
}

const ChapterPage = ({ chapterId }: { chapterId: string }) => {
	const [chapter, setChapter] = useState<ChapterType | null>();
	const [loading, setLoading] = useState<boolean>(false);
	useEffect(() => {
		getChapter();
	}, []);
	const getChapter = async () => {
		setLoading(true);
		try {
			const res = await fetch(`/api/regional-franchise/chapters/${chapterId}`);
			console.log(res);
			if (!res.ok) {
				toast.error("failed to load Chapters");
				return;
			}
			const result = await res.json();

			if (result.message === "success" && result.data) {
				setChapter(result.data);
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
			{chapter ? (
				<div className="grid lg:grid-cols-2 gap-4">
					<div key={chapter.id}>
						<p>{chapter.name}</p>
						<p>{chapter.code}</p>
						<p>{chapter.regionId}</p>
					</div>
					{chapter.clubs && <Clubs clubs={chapter.clubs} />}
				</div>
			) : (
				<div>Chapter with id {chapterId} is not found.</div>
			)}
		</div>
	);
};

export default ChapterPage;
