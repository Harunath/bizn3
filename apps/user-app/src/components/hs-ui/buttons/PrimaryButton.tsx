import React, { ReactNode } from "react";

const PrimaryButton = ({
	children,
	click,
}: {
	children: ReactNode;
	click: () => void;
}) => {
	return (
		<button
			className="min-w-20 text-center bg-blue-500 text-white hover:bg-blue-600 hover:text-gray-200 p-2 rounded transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
			onClick={() => click()}>
			{children}
		</button>
	);
};

export default PrimaryButton;
