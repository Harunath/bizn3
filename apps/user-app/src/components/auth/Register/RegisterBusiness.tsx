"use client";
import { useState } from "react";
import { z } from "zod";
import { upload } from "@repo/common/upload";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";
import { Steps, useUser } from "../../../lib/store/user";
import RedCircleLoading from "../../common/loading/RedCircleLoading";

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

const RegisterBusiness = ({ userId }: { userId: string }) => {
	const [businessName, setBusinessName] = useState("");
	const [images, setImages] = useState<string[]>([]);
	const [category, setCategory] = useState("");
	const [panNumber, setPanNumber] = useState<string | undefined>("");
	const [gstNumber, setGstNumber] = useState<string | undefined>("");
	const [errors, setErrors] = useState<z.ZodError<BusinessDetails> | null>(
		null
	);
	const [imagePreviews, setImagePreviews] = useState<string[]>();
	const [rawFiles, setRawFiles] = useState<File[]>();
	const [loadingImages, setLoadingImages] = useState(false);
	const [loading, setLoading] = useState(false);
	const { setStep } = useUser();

	const refreshSession = async () => {
		const updatedSession = await getSession();
		console.log("Refreshed session:", updatedSession);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoadingImages(true);
		const files = e.target.files;
		if (!files) return;
		if (files.length > 5) {
			setLoadingImages(false);
		}
		const filesArray = Array.from(files);

		const readers = filesArray.map((file) => {
			return new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result as string);
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
		});

		Promise.all(readers).then((base64Images) => {
			setImagePreviews((prev = []) => [...prev, ...base64Images]);
			setRawFiles((prev = []) => [...prev, ...filesArray]);
		});
		setLoadingImages(false);
	};

	const handleImageUpload = async (): Promise<string[]> => {
		if (!rawFiles || !rawFiles.length) return [];
		if (rawFiles.length > 5) {
			toast.info("max images limit is 5");
			return [];
		}
		const res = await fetch("/api/user/upload-image", {
			method: "POST",
		});
		const result = await res.json();
		const { signature, timestamp, folder, apiKey, cloudName } = result;
		const filesArray = Array.from(rawFiles);
		const urls = await upload({
			signature,
			files: filesArray,
			timestamp,
			folder,
			apiKey,
			cloudName,
		});
		return urls;
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);

		const uploadedImages = await handleImageUpload();

		const businessDetailsData: BusinessDetails = {
			businessName,
			images: uploadedImages,
			category,
			panNumber: panNumber || undefined,
			gstNumber: gstNumber || undefined,
		};

		const validationResult =
			businessDetailsSchema.safeParse(businessDetailsData);

		if (validationResult.success) {
			setErrors(null);

			const res = await fetch(`/api/user/${userId}/business`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					businessName,
					images: uploadedImages,
					generalCategory: category,
				}),
			});

			const data = await res.json();
			console.log(data);

			if (data.message == "success") {
				toast.success(
					`${data.data.businessName} business is successfully created`
				);

				refreshSession();
				setStep(Steps.HOMECLUB);
				setBusinessName("");
				setImages([]);
				setCategory("");
				setPanNumber(undefined);
				setGstNumber(undefined);
			}
			setLoading(false);
		} else {
			setErrors(validationResult.error);
			setLoading(false);
		}
	};
	return (
		<div className="min-w-[360px] w-[360px] lg:w-[80%] flex justify-center items-center">
			{loading && <RedCircleLoading />}
			<div className="hidden lg:block w-1/3">
				<p className="text-4xl text-red-600 text-center">Biz Network</p>
				<p className="text-xl text-red-600 text-center">Registration</p>
			</div>
			<form
				onSubmit={handleSubmit}
				className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-2">
				<div className=" text-3xl text-red-600">
					<p>Business Registration</p>
				</div>
				<div className="flex gap-x-4">
					<div>
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
					<div>
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
				</div>
				<div>
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
						disabled={images.length >= 5}
					/>
					{loadingImages && (
						<div className=" relative">
							<div className=" absolute backdrop-blur-sm inset-0 flex justify-center items-center">
								<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
							</div>
						</div>
					)}
					{imagePreviews && imagePreviews.length > 0 && (
						<div className="w-[400px] flex gap-x-4 mt-2 overflow-x-auto flex-nowrap scrollbar-hide">
							{imagePreviews.map((src, idx) => (
								<div
									key={idx}
									className="relative group w-auto h-60 flex-shrink-0">
									<img
										src={src}
										alt={`Preview ${idx + 1}`}
										className="rounded shadow w-auto h-60 object-fill"
									/>
									<button
										onClick={() => {
											setImagePreviews((prev = []) =>
												prev.filter((_, i) => i !== idx)
											);
											setRawFiles((prev = []) =>
												prev.filter((_, i) => i !== idx)
											);
										}}
										className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs hidden group-hover:block">
										&times;
									</button>
								</div>
							))}
						</div>
					)}
					{imagePreviews && imagePreviews.length > 5 && (
						<div>
							<p className="text-red-500 text-xs italic">
								max images limit is 5
							</p>
						</div>
					)}
					{errors?.formErrors.fieldErrors.images && (
						<p className="text-red-500 text-xs italic">
							{errors.formErrors.fieldErrors.images.join(", ")}
						</p>
					)}
				</div>

				<div>
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
						className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
							!imagePreviews ||
							loading ||
							loadingImages ||
							!businessName ||
							!category
								? " cursor-not-allowed"
								: " cursor-pointer"
						}`}
						type="submit"
						disabled={
							!imagePreviews ||
							loading ||
							loadingImages ||
							!businessName ||
							!category
						}>
						Submit Details
					</button>
				</div>
			</form>
		</div>
	);
};

export default RegisterBusiness;
