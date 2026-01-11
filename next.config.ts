/**
 * file: next.config.ts
 * description: Increased Server Actions body limit to 10MB to allow image uploads.
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Increased from default 1MB
    },
  },
};

export default nextConfig;