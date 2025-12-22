import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	serverExternalPackages: [
		"@prisma/adapter-libsql",
		"@libsql/client",
		"@prisma/client",
	],
	turbopack: {
		root: path.join(__dirname),
	},
};

export default nextConfig;
