import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['wallpapercave.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
  },

};

export default nextConfig;
