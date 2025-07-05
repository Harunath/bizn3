import React from "react";

function RedCircleLoading() {
	return (
		<div className="fixed inset-0 z-50 backdrop-blur-xs flex justify-center items-center">
			<div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
		</div>
	);
}

export default RedCircleLoading;
