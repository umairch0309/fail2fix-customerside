import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/marketing/constants";
import { LOCATION_PAGES } from "@/lib/marketing/locations";
import { BLOG_CMS_URL } from "@/lib/constants";

export const revalidate = 3600;

async function fetchBlogSlugs(): Promise<string[]> {
  try {
    const params = new URLSearchParams({
      "where[status][equals]": "published",
      limit: "100",
      depth: "0",
    });
    const response = await fetch(`${BLOG_CMS_URL}/api/blogs?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return (data.docs ?? [])
      .map((blog: { slug?: string }) => blog.slug)
      .filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const blogSlugs = await fetchBlogSlugs();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/howitworks`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogSlugs.map((slug) => ({
      url: `${SITE_URL}/blogs/${slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...LOCATION_PAGES.map(({ slug }) => ({
      url: `${SITE_URL}/mot-repairs-${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    {
      url: `${SITE_URL}/privacypolicy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/termsofservice`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cookiepolicy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
