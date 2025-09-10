import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	basePath: process.env.NODE_ENV === "production" ? "/lowcode-editor" : "",
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
