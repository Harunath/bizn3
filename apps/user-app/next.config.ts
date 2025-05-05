import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		formats: ["image/avif", "image/webp"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "static.vecteezy.com",
			},
		],
	},
};

export default nextConfig;
