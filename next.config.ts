import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blog.fail2fix.co.uk",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion", "date-fns"],
  },
};

export default nextConfig;
