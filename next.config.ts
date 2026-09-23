import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  allowedDevOrigins: [
    "chargers-keywords-powerful-convicted.trycloudflare.com",
  ],
};

export default nextConfig;