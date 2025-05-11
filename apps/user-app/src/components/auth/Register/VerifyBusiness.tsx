"use client";
import React, { useState } from "react";
import PrimaryButton from "../../hs-ui/buttons/PrimaryButton";

const VerifyBusiness = ({ nextStep }: { nextStep: () => void }) => {
	const [gstNumber, setGstNumber] = useState("");
	const [panNumber, setPanNumber] = useState("");
	return (
		<div className="bg-white rounded-xl p-4">
			<div className="mb-4">
				<label
					htmlFor="panNumber"
					className="block text-gray-700 text-sm font-bold mb-2">
					PAN Number (Optional)
				</label>
				<input
					type="text"
					id="panNumber"
					className="shadow appearance-none border border-blue-400 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-400 "
					value={panNumber}
					onChange={(e) => setPanNumber(e.target.value)}
				/>
				{/* {errors?.formErrors.fieldErrors.panNumber && (
					<p className="text-red-500 text-xs italic">
						{errors.formErrors.fieldErrors.panNumber.join(", ")}
					</p>
				)} */}
			</div>

			<div className="mb-6">
				<label
					htmlFor="gstNumber"
					className="block text-gray-700 text-sm font-bold mb-2">
					GST Number (Optional)
				</label>
				<input
					type="text"
					id="gstNumber"
					className="shadow appearance-none border border-blue-400 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline"
					value={gstNumber}
					onChange={(e) => setGstNumber(e.target.value)}
				/>
				{/* {errors?.formErrors.fieldErrors.gstNumber && (
					<p className="text-red-500 text-xs italic">
						{errors.formErrors.fieldErrors.gstNumber.join(", ")}
					</p>
				)} */}
			</div>
			<PrimaryButton click={() => nextStep()}>Skip</PrimaryButton>
		</div>
	);
};

export default VerifyBusiness;
