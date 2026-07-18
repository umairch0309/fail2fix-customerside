import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3007").replace(
  /\/$/,
  "",
);

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
  // Proxy Better Auth through the frontend origin so session cookies are
  // first-party on failfix-animation.vercel.app (required for SSR guards).
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${apiUrl}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
