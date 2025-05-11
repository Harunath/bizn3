"use client";
import { useState } from "react";
import { z } from "zod";

// Define the Zod schema for BusinessDetails
const businessDetailsSchema = z.object({
	businessName: z
		.string()
		.min(2, { message: "Business name must be at least 2 characters." }),
	images: z
		.array(z.string().url({ message: "Each image must be a valid URL." }))
		.min(1, { message: "Please upload at least one image." }),
	category: z
		.string()
		.min(2, { message: "Category must be at least 2 characters." }),
	panNumber: z
		.string()
		.optional()
		.refine((val) => !val || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val), {
			message: "PAN number is invalid.",
		}),
	gstNumber: z
		.string()
		.optional()
		.refine(
			(val) =>
				!val ||
				/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val),
			{
				message: "GST number is invalid.",
			}
		),
});

// Infer the TypeScript type from the Zod schema
type BusinessDetails = z.infer<typeof businessDetailsSchema>;

const RegisterBusiness = ({ nextStep }: { nextStep: () => void }) => {
	const [businessName, setBusinessName] = useState("");
	const [images, setImages] = useState<string[]>([]);
	const [category, setCategory] = useState("");
	const [panNumber, setPanNumber] = useState<string | undefined>("");
	const [gstNumber, setGstNumber] = useState<string | undefined>("");
	const [errors, setErrors] = useState<z.ZodError<BusinessDetails> | null>(
		null
	);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const businessDetailsData: BusinessDetails = {
			businessName,
			images,
			category,
			panNumber: panNumber || undefined,
			gstNumber: gstNumber || undefined,
		};

		const validationResult =
			businessDetailsSchema.safeParse(businessDetailsData);

		if (validationResult.success) {
			setErrors(null);
			// api call;
			const res = await fetch("/api/user/business", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: businessName,
					images,
					category,
				}),
			});
			const data = await res.json();
			if (data.message == "success" && data.data.id) {
				console.log(data.data);
				// Optionally reset the form here
				setBusinessName("");
				setImages([]);
				setCategory("");
				setPanNumber(undefined);
				setGstNumber(undefined);
				nextStep();
			}
		} else {
			setErrors(validationResult.error);
		}
	};

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const newImages: string[] = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (file) {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				// Wrap FileReader in a Promise so we can await it
				await new Promise<void>((resolve) => {
					reader.onloadend = () => {
						if (reader.result && typeof reader.result === "string") {
							newImages.push(reader.result);
						}
						resolve();
					};
				});
			}
		}

		// Limit to 5 images total
		setImages((prevImages) => [...prevImages, ...newImages].slice(0, 5));
	};

	// const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	const files = event.target.files;
	// 	if (files) {
	// 		const newImages: string[] = [];
	// 		for (let i = 0; i < files.length; i++) {
	// 			const file = files[i]; // Get the file at the current index
	// 			if (file) {
	// 				// Check if the file exists before processing it
	// 				const reader = new FileReader();
	// 				reader.onloadend = () => {
	// 					if (reader.result && typeof reader.result === "string") {
	// 						newImages.push(reader.result);
	// 						setImages((prevImages) => [...prevImages, ...newImages]);
	// 					}
	// 				};
	// 				reader.readAsDataURL(file);
	// 			}
	// 		}
	// 	}
	// };

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
			<div className="mb-4">
				<label
					htmlFor="businessName"
					className="block text-gray-700 text-sm font-bold mb-2">
					Business Name
				</label>
				<input
					type="text"
					id="businessName"
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					value={businessName}
					onChange={(e) => setBusinessName(e.target.value)}
				/>
				{errors?.formErrors.fieldErrors.businessName && (
					<p className="text-red-500 text-xs italic">
						{errors.formErrors.fieldErrors.businessName.join(", ")}
					</p>
				)}
			</div>

			<div className="mb-4">
				<label
					htmlFor="images"
					className="block text-gray-700 text-sm font-bold mb-2">
					Images
				</label>
				<input
					type="file"
					id="images"
					accept="image/*"
					multiple
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					onChange={handleImageChange}
				/>
				{/* {images.length > 0 && (
					<div className="mt-2 flex space-x-2">
						{images.map((image, index) => (
							<Image
								key={index}
								src={image}
								alt={`Uploaded ${index + 1}`}
								className="w-20 h-20 object-cover rounded"
							/>
						))}
					</div>
				)} */}
				{errors?.formErrors.fieldErrors.images && (
					<p className="text-red-500 text-xs italic">
						{errors.formErrors.fieldErrors.images.join(", ")}
					</p>
				)}
			</div>

			<div className="mb-4">
				<label
					htmlFor="category"
					className="block text-gray-700 text-sm font-bold mb-2">
					Category
				</label>
				<input
					type="text"
					id="category"
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					value={category}
					onChange={(e) => setCategory(e.target.value)}
				/>
				{errors?.formErrors.fieldErrors.category && (
					<p className="text-red-500 text-xs italic">
						{errors.formErrors.fieldErrors.category.join(", ")}
					</p>
				)}
			</div>

			<div className="mb-4">
				<label
					htmlFor="panNumber"
					className="block text-gray-700 text-sm font-bold mb-2">
					PAN Number (Optional)
				</label>
				<input
					type="text"
					id="panNumber"
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					value={panNumber}
					onChange={(e) => setPanNumber(e.target.value)}
				/>
				{errors?.formErrors.fieldErrors.panNumber && (
					<p className="text-red-500 text-xs italic">
						{errors.formErrors.fieldErrors.panNumber.join(", ")}
					</p>
				)}
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
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					value={gstNumber}
					onChange={(e) => setGstNumber(e.target.value)}
				/>
				{errors?.formErrors.fieldErrors.gstNumber && (
					<p className="text-red-500 text-xs italic">
						{errors.formErrors.fieldErrors.gstNumber.join(", ")}
					</p>
				)}
			</div>

			{errors &&
				!errors.formErrors.fieldErrors.businessName &&
				!errors.formErrors.fieldErrors.images &&
				!errors.formErrors.fieldErrors.category &&
				!errors.formErrors.fieldErrors.panNumber &&
				!errors.formErrors.fieldErrors.gstNumber && (
					<div
						className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
						role="alert">
						<strong className="font-bold">Validation Error!</strong>
						<span className="block sm:inline">
							Please check the form for errors.
						</span>
					</div>
				)}

			<div className="flex items-center justify-between">
				<button
					className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					type="submit">
					Submit Details
				</button>
			</div>
		</form>
	);
};

export default RegisterBusiness;
