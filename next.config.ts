import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blog.fail2fix.co.uk',
      },
    ],
  },
};

export default nextConfig;
