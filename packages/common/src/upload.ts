import { v2 as cloudinary } from "cloudinary";

// export async function uploadImage({
// 	image,
// 	public_id,
// }: {
// 	image: string;
// 	public_id: string;
// }) {
// 	try {
// 		const uploadResult = await upload(image, public_id);
// 		console.log(uploadResult);
// 		return uploadResult;
// 	} catch (error) {
// 		console.error("Upload Error: ", error);
// 		return "https://res.cloudinary.com/degrggosz/image/upload/v1740054227/online-course-default_xaqmcr.webp";
// 	}
// }

export async function upload({
	image,
	public_id,
	fetch_format,
	quality,
}: {
	image: string;
	public_id: string;
	fetch_format?: string;
	quality?: string;
}) {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});

	try {
		// Upload image to Cloudinary
		const uploadResult = await cloudinary.uploader.upload(image, {
			public_id: `${public_id}`,
		});

		// Return the URL for optimized delivery
		return cloudinary.url(uploadResult.public_id, {
			fetch_format: fetch_format || "auto",
			quality: quality || "auto",
		});
	} catch (error) {
		console.error("Cloudinary Upload Error: ", error);
		throw new Error("Failed to upload image to Cloudinary.");
	}
}

// async function upload(image: string, public_id: string) {
// 	cloudinary.config({
// 		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// 		api_key: process.env.CLOUDINARY_API_KEY,
// 		api_secret: process.env.CLOUDINARY_API_SECRET,
// 	});

// 	try {
// 		// Upload image to Cloudinary
// 		const date = JSON.stringify(new Date());
// 		const uploadResult = await cloudinary.uploader.upload(image, {
// 			public_id: `${public_id + date}`,
// 		});

// 		// Return the URL for optimized delivery
// 		return cloudinary.url(uploadResult.public_id, {
// 			fetch_format: "auto",
// 			quality: "auto",
// 		});
// 	} catch (error) {
// 		console.error("Cloudinary Upload Error: ", error);
// 		throw new Error("Failed to upload image to Cloudinary.");
// 	}
// }
