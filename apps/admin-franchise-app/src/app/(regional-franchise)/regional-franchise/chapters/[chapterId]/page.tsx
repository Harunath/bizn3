import React from "react";
import ChapterPage from "../../../../../components/regional-franchise/chapters/Chapter";
import CreateClub from "../../../../../components/regional-franchise/clubs/CreateClub";

const page = async ({
	params,
}: {
	params: Promise<{
		chapterId: string;
	}>;
}) => {
	const slug = await params;
	return (
		<div>
			<p>Chapter : {slug.chapterId}</p>
			<CreateClub chapterId={slug.chapterId} />
			<div className=" relative">
				<ChapterPage chapterId={slug.chapterId} />
			</div>
		</div>
	);
};

export default page;
