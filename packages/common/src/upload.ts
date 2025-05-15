export async function upload({
	files,
	signature,
	timestamp,
	apiKey,
	cloudName,
	folder,
}: {
	files: File[];
	signature: string;
	timestamp: number;
	apiKey: string;
	cloudName: string;
	folder: string;
}): Promise<string[]> {
	const urls: string[] = [];

	for (const file of files) {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("api_key", apiKey);
		formData.append("timestamp", String(timestamp));
		formData.append("signature", signature);
		formData.append("folder", folder);

		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
			{
				method: "POST",
				body: formData,
			}
		);

		if (!res.ok) {
			throw new Error("Failed to upload image");
		}

		const data = await res.json();
		urls.push(data.secure_url);
	}

	return urls;
}
