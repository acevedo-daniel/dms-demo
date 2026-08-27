import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  distDir: process.env.DMS_NEXT_DIST_DIR ?? ".next",
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ["drizzle-orm", "pg"],
};

export default nextConfig;
