import React from "react";
import ClubPage from "../../../../../components/regional-franchise/clubs/ClubPage";

const page = async ({
	params,
}: {
	params: Promise<{
		club_id: string;
	}>;
}) => {
	const slug = await params;
	return (
		<div>
			slub : {slug.club_id}
			<ClubPage clubId={slug.club_id} />
		</div>
	);
};

export default page;
