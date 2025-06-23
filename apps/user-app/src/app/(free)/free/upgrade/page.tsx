import Link from "next/link";
import React from "react";

function page() {
	return (
		<div>
			Free upgrade
			<div>
				<Link href="/free/upgrade/gold">Gold</Link>
			</div>
			<div>
				<Link href="/free/upgrade/vip">Vip</Link>
			</div>
		</div>
	);
}

export default page;
