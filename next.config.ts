import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "img.clerk.com" },
			{ protocol: "https", hostname: "images.unsplash.com" },
			{ protocol: "https", hostname: "img.freepik.com" },
			{ protocol: "https", hostname: "cdn5.vectorstock.com" },
		],
	},
};

export default nextConfig;
