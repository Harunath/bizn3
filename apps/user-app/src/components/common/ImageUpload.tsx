"use client";
import Image from "next/image";
import { useState } from "react";

export default function ImageUpload() {
	const [images, setImages] = useState<string[]>([]);
	const [public_id, setPublic_id] = useState<string>("testing");
	const [uploadStatus, setUploadStatus] = useState<string>("");
	const [preview, setPreview] = useState<string | null>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

	const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (images.length == 0) {
			alert("Please select a file first.");
			return;
		}

		try {
			const response = await fetch("/api/upload-image", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					images, // Base64 image string
					public_id,
				}),
			});
			const data = await response.json();

			if (response.ok) {
				setUploadStatus("Image uploaded successfully!");
				console.log("image", data.imageUrl);
				setPreview(data.imageUrl);
			} else {
				setUploadStatus("Failed to upload image.");
			}
		} catch (error) {
			console.error("Error uploading image:", error);
			setUploadStatus("Error uploading image.");
		}
	};

	return (
		<div className="mt-4">
			<form
				onSubmit={handleUpload}
				className="flex flex-col gap-4 items-center">
				<input type="file" accept="image/*" onChange={handleFileChange} />
				<input
					type="text"
					onChange={(e) => setPublic_id(e.target.value)}
					value={public_id}
					placeholder="Enter public_id"
				/>
				<button type="submit">Upload</button>
			</form>
			{uploadStatus && <p>{uploadStatus}</p>}
			<div>
				{preview && (
					<Image
						src={
							"https://res.cloudinary.com/degrggosz/image/upload/v1726644364/testing.jpg"
						}
						height={400}
						width={400}
						alt="failed to load"
					/>
				)}
			</div>
		</div>
	);
}
