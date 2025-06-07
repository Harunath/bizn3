import React from "react";

function Phone({ nextStep }: { nextStep: () => void }) {
	return (
		<div>
			Phone
			<button onClick={nextStep}></button>
		</div>
	);
}

export default Phone;
