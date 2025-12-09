import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  serverExternalPackages: [
    "@prisma/adapter-libsql",
    "@libsql/client",
    "@prisma/client",
  ],
};

export default nextConfig;
