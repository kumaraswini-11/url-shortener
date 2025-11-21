import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  typedRoutes: true,
  reactCompiler: true,
  cacheComponents: true,
};

export default nextConfig;
