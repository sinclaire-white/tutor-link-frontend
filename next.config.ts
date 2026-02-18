import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
       {
        hostname: "i.pravatar.cc",
      },
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
  