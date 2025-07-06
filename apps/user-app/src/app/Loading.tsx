import React from "react";

async function Loading() {
	await new Promise((resolve) => {
		setTimeout(() => {
			resolve("intentional delay");
		}, 2000);
	});
	return <div>Loading</div>;
}

export default Loading;
