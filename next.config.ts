/**
 * file: next.config.ts
 * description: Increased Server Actions body limit to 200MB for larger video uploads.
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb', // Increased to 200MB
    },
  },
};

export default nextConfig;