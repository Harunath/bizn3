import React, { ReactNode } from "react";
import Navbar from "../../components/common/NavBar";

const layout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="min-h-screen w-screen">
			<Navbar />
			<div className="pt-16 px-2">{children}</div>
		</div>
	);
};

export default layout;
