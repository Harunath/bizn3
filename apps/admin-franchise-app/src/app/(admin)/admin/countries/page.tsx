import Link from "next/link";
import React from "react";
import Countries from "../../../../components/admin/countries/Countries";

const page = () => {
	return (
		<div>
			<Link href="/admin/countries/create">Create Country</Link>
			<div>
				<Countries />
			</div>
		</div>
	);
};

export default page;
