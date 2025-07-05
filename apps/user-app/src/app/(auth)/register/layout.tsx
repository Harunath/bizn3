import React, { ReactNode } from "react";
// import Navbar from "../../components/common/NavBar";

const layout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<div className=" h-24 w-full flex justify-between items-center shadow-md bg-slate-200">
				<h2 className=" text-3xl font-bold text-red-600 w-full text-center">
					Biz Network Registration{" "}
				</h2>
			</div>
			<div>{children}</div>
		</div>
	);
};

export default layout;
