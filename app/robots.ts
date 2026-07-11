import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/marketing/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/quotes",
          "/requests",
          "/payments",
          "/orders",
          "/chats",
          "/login",
          "/signup",
          "/verify-email",
          "/set-password",
          "/forgot-password",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
