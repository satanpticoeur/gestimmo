import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "1nakmlwzahlaqscy.public.blob.vercel-storage.com",
        port: "",
        pathname: "/store_1nakMLWzAhLAqsCy/**",
      },
    ],
  },
};

export default nextConfig;
