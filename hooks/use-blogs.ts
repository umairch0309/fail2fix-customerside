"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { BLOG_CMS_URL } from "@/lib/constants";
import type { Blog, BlogsResponse, BlogMedia } from "@/types/blog";
//ello
/**
 * Blog Hooks
 * Fetches blog content from Payload CMS
 */

/**
 * Get all published blogs (both featured and regular)
 */
export function useBlogs(options?: { page?: number; limit?: number }) {
  const { page = 1, limit = 50 } = options || {};

  return useQuery({
    queryKey: queryKeys.blogs.list({ page, limit }),
    queryFn: async (): Promise<BlogsResponse> => {
      const params = new URLSearchParams({
        "where[status][equals]": "published",
        limit: String(limit),
        page: String(page),
        sort: "-publishedDate",
        depth: "1",
      });

      const response = await fetch(`${BLOG_CMS_URL}/api/blogs?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.status}`);
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get featured blogs only
 */
export function useFeaturedBlogs() {
  return useQuery({
    queryKey: [...queryKeys.blogs.all, "featured"],
    queryFn: async (): Promise<Blog[]> => {
      const params = new URLSearchParams({
        "where[status][equals]": "published",
        "where[featured][equals]": "true",
        sort: "-publishedDate",
        depth: "1",
        limit: "10",
      });

      const response = await fetch(`${BLOG_CMS_URL}/api/blogs?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch featured blogs: ${response.status}`);
      }

      const data: BlogsResponse = await response.json();
      return data.docs;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get regular (non-featured) blogs
 */
export function useRegularBlogs(options?: { page?: number; limit?: number }) {
  const { page = 1, limit = 20 } = options || {};

  return useQuery({
    queryKey: [...queryKeys.blogs.all, "regular", { page, limit }],
    queryFn: async (): Promise<BlogsResponse> => {
      const params = new URLSearchParams({
        "where[status][equals]": "published",
        "where[featured][not_equals]": "true",
        limit: String(limit),
        page: String(page),
        sort: "-publishedDate",
        depth: "1",
      });

      const response = await fetch(`${BLOG_CMS_URL}/api/blogs?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.status}`);
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get a single blog by slug
 */
export function useBlog(slug?: string) {
  return useQuery({
    queryKey: queryKeys.blogs.detail(slug || ""),
    queryFn: async (): Promise<Blog | null> => {
      if (!slug) return null;

      const params = new URLSearchParams({
        "where[slug][equals]": slug,
        "where[status][equals]": "published",
        depth: "3",
      });

      const response = await fetch(`${BLOG_CMS_URL}/api/blogs?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch blog: ${response.status}`);
      }

      const data: BlogsResponse = await response.json();
      return data.docs[0] || null;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get the full URL for a media item from the CMS
 */
export function getMediaUrl(media: BlogMedia | number | null | undefined): string | null {
  if (!media) return null;
  if (typeof media === "number") return null;
  if (!media.url) return null;

  // If URL is already absolute, return it
  if (media.url.startsWith("http")) return media.url;

  // Otherwise prepend the CMS URL
  return `${BLOG_CMS_URL}${media.url}`;
}

/**
 * Format date from CMS for display
 */
export function formatBlogDate(dateString?: string | null): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Get author display name
 */
export function getAuthorName(author: Blog["author"]): string {
  if (!author) return "Fail2Fix Team";
  if (typeof author === "number") return "Fail2Fix Team";
  return author.name || author.email?.split("@")[0] || "Fail2Fix Team";
}

/**
 * Get featured image URL with fallback
 */
export function getFeaturedImageUrl(featuredImage: Blog["featuredImage"]): string {
  const url = getMediaUrl(featuredImage as BlogMedia);
  return url || "/images/guide-1.png";
}

/**
 * Get blog excerpt with fallback
 */
export function getBlogExcerpt(blog: Blog): string {
  if (blog.excerpt) return blog.excerpt;
  return "Read more about this topic...";
}
