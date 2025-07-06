import React, { ReactNode } from "react";
// import Navbar from "../../components/common/NavBar";

const layout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="min-h-screen w-screen bg-slate-100 text-black">
			<div>{children}</div>
		</div>
	);
};

export default layout;
