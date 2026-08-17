import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "standalone",
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
  // /api/auth/* and other /api/* are proxied via app/api route handlers.
};

export default nextConfig;
