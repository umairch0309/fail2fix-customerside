import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SingleBlogContent from "@/app/sections/blogs/singleblog/SingleBlogContent";
import Getaquote from "@/app/sections/home/getaquote";
import { BLOG_CMS_URL } from "@/lib/constants";
import type { Blog, BlogsResponse, BlogMedia } from "@/types/blog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fetch blog by slug for server-side rendering
async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const params = new URLSearchParams({
      "where[slug][equals]": slug,
      "where[status][equals]": "published",
      depth: "2",
    });

    const res = await fetch(`${BLOG_CMS_URL}/api/blogs?${params}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data: BlogsResponse = await res.json();
    return data.docs[0] || null;
  } catch {
    return null;
  }
}

// Fetch all blog slugs for static generation
async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const params = new URLSearchParams({
      "where[status][equals]": "published",
      limit: "100",
    });

    const res = await fetch(`${BLOG_CMS_URL}/api/blogs?${params}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data: BlogsResponse = await res.json();
    return data.docs.map((blog) => blog.slug);
  } catch {
    return [];
  }
}

// Generate static params for all blogs
export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Helper to get media URL
function getMediaUrl(media: BlogMedia | number | null | undefined): string | null {
  if (!media) return null;
  if (typeof media === "number") return null;
  if (!media.url) return null;
  if (media.url.startsWith("http")) return media.url;
  return `${BLOG_CMS_URL}${media.url}`;
}

// Generate SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | Fail2Fix",
      description: "The blog post you are looking for could not be found.",
    };
  }

  const title = blog.seo?.metaTitle || `${blog.title} | Fail2Fix`;
  const description = blog.seo?.metaDescription || blog.excerpt || `Read ${blog.title} on Fail2Fix`;

  // Get OG image - prioritize SEO ogImage, fallback to featuredImage
  const ogImageMedia = blog.seo?.ogImage || blog.featuredImage;
  const ogImage = getMediaUrl(ogImageMedia as BlogMedia);

  return {
    title,
    description,
    keywords: blog.tags?.map((t) => t.tag).filter(Boolean).join(", ") || undefined,
    authors: blog.author && typeof blog.author !== "number"
      ? [{ name: blog.author.name || blog.author.email }]
      : [{ name: "Fail2Fix Team" }],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: blog.publishedDate || undefined,
      modifiedTime: blog.updatedAt,
      url: `https://fail2fix.co.uk/blogs/${blog.slug}`,
      siteName: "Fail2Fix",
      images: ogImage ? [{ url: ogImage, alt: blog.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: `https://fail2fix.co.uk/blogs/${blog.slug}`,
    },
  };
}

// Generate JSON-LD structured data
function generateJsonLd(blog: Blog) {
  const ogImageMedia = blog.seo?.ogImage || blog.featuredImage;
  const ogImage = getMediaUrl(ogImageMedia as BlogMedia);

  const authorName = blog.author && typeof blog.author !== "number"
    ? blog.author.name || blog.author.email
    : "Fail2Fix Team";

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt || "",
    image: ogImage || undefined,
    datePublished: blog.publishedDate || blog.createdAt,
    dateModified: blog.updatedAt,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Fail2Fix",
      url: "https://fail2fix.co.uk",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://fail2fix.co.uk/blogs/${blog.slug}`,
    },
  };
}

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const jsonLd = generateJsonLd(blog);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SingleBlogContent blog={blog} />
      <Getaquote />
    </>
  );
};

export default Page;
