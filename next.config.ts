import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ["drizzle-orm", "pg"],
};

export default nextConfig;
