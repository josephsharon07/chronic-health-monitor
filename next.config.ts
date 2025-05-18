import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Enable static exports for `next export`
  images: {
    unoptimized: true, // Required for static export
  },
  // Disable server-only features since we're doing static export
  trailingSlash: true, // Recommended for static exports
};

export default nextConfig;
