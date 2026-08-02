import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow serving images from any domain for uploaded images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Optimize images with Sharp
    formats: ["image/avif", "image/webp"],
  },
  // Enable experimental features
  experimental: {
    // Server actions for form handling
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Empty turbopack config to silence the webpack config warning
  turbopack: {},
};

export default nextConfig;
