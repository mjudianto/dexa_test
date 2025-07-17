import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5050",        // your backend’s port
        pathname: "/uploads/**", // whatever path your avatars live under
      },
    ],
  },
};

export default nextConfig;
