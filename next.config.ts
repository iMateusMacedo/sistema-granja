import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    devIndicators: {
      buildActivity: false,
      buildActivityPosition: 'bottom-right',
    },
  },
  /* config options here */
};

export default nextConfig;
