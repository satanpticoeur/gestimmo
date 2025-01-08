import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "1nakmlwzahlaqscy.public.blob.vercel-storage.com",
        port: "",
        pathname: "/announcements/**",
      },
    ],
  },
};

export default nextConfig;
