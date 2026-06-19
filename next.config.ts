import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [new URL("https://x.kalvium.com/**")],
  },
};

export default nextConfig;
