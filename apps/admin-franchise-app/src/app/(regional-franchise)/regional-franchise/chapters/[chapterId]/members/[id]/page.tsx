import React from "react";
import AdminUserDetail from "../../../../../../../components/regional-franchise/clubs/user/AdminUserDetail";

const page = async ({
	params,
}: {
	params: Promise<{
		id: string;
	}>;
}) => {
	const slug = await params;
	return <AdminUserDetail userId={slug.id} />;
};

export default page;
