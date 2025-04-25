import Link from "next/link";
import React from "react";

const page = () => {
	return (
		<div>
			Super franchise dashboard
			<Link href="/super-franchise/create">Create a super franchise</Link>
		</div>
	);
};

export default page;
