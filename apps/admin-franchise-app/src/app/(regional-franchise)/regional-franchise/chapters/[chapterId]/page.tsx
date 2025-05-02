import React from "react";
import Clubs from "../../../../../components/regional-franchise/chapters/Clubs";

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
			<Clubs />
		</div>
	);
};

export default page;
