import React, { ReactNode } from "react";
// import Navbar from "../../components/common/NavBar";

const layout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="min-h-screen w-screen bg-white text-black">
			{/* <Navbar /> */}
			<div>{children}</div>
		</div>
	);
};

export default layout;
