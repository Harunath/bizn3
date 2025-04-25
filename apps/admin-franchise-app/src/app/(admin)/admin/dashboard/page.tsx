import Link from "next/link";
import React from "react";
import { BiArrowFromLeft } from "react-icons/bi";

const page = () => {
	return (
		<div>
			<div className="flex items-center gap-x-4 p-2 mb-2">
				<BiArrowFromLeft />
				<Link className="text-blue-400" href="/admin/countries">
					countries
				</Link>
				<Link className="text-blue-400" href="/admin/register-franchise">
					register-franchise
				</Link>
				<Link className="text-blue-400" href="/admin/register-franchise-admin">
					register-franchise-admin
				</Link>
			</div>
			<h2 className=" text-3xl text-red-500">admin dashboard</h2>
			<p>
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestias
				iusto officiis fugiat dolorem autem minima impedit sapiente dolorum id!
				Minus velit, modi quisquam hic sunt odio molestiae officia laboriosam
				commodi.
			</p>
		</div>
	);
};

export default page;
