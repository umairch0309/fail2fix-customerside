import Padding from "@/components/padding";
import Image from "next/image";
import Profile from "@/public/icons/profile";
import { RichText } from "@/components/rich-text";
import { BLOG_CMS_URL } from "@/lib/constants";
import type { Blog, BlogMedia } from "@/types/blog";

interface SingleBlogContentProps {
  blog: Blog;
}

function getMediaUrl(media: BlogMedia | number | null | undefined): string | null {
  if (!media) return null;
  if (typeof media === "number") return null;
  if (!media.url) return null;
  if (media.url.startsWith("http")) return media.url;
  return `${BLOG_CMS_URL}${media.url}`;
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "-");
}

function getAuthorName(author: Blog["author"]): string {
  if (!author) return "Fail2Fix Team";
  if (typeof author === "number") return "Fail2Fix Team";
  return author.name || author.email?.split("@")[0] || "Fail2Fix Team";
}

const SingleBlogContent = ({ blog }: SingleBlogContentProps) => {
  const featuredImageUrl = getMediaUrl(blog.featuredImage as BlogMedia);
  const authorName = getAuthorName(blog.author);
  const publishedDate = formatDate(blog.publishedDate);

  return (
    <Padding className="py-10 md:py-20">
      <div className="max-w-[1700px] mx-auto min-h-screen">
        <div className="space-y-4 md:space-y-6">
          {/* Header */}
          <div className="text-center flex flex-col items-center gap-1.5">
            <h1 className="font-polysanstrial font-semibold text-[1.75rem] sm:text-[2.5rem] md:text-[3.25rem] max-w-[800px] leading-[1.25]">
              {blog.title}
            </h1>
            {blog.excerpt && (
              <p className="text-[#787878] font-inter font-medium text-[0.8rem] md:text-[0.9rem] uppercase max-w-[520px]">
                {blog.excerpt}
              </p>
            )}
          </div>

          {/* Featured Image */}
          {featuredImageUrl && (
            <div className="rounded-[14px] md:rounded-[22px] overflow-hidden relative">
              <div className="absolute bottom-4 md:bottom-10 text-white text-sm md:text-base px-4 md:px-12 flex justify-between w-full z-20">
                <div className="flex items-center gap-2">
                  <Profile color="white" />
                  {authorName}
                </div>
                <div>{publishedDate}</div>
              </div>
              <div className="min-w-full min-h-full absolute z-10 bg-linear-to-t from-black/40 to-transparent" />
              <Image
                src={featuredImageUrl}
                alt={blog.title}
                width={1700}
                height={600}
                className="w-full min-h-[30vh] max-h-[60vh] object-cover"
                priority
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="max-w-[900px] mx-auto py-8 md:py-16">
          <RichText
            content={blog.content}
            className="prose prose-lg max-w-none
              prose-headings:font-polysanstrial prose-headings:text-[#130A09]
              prose-h1:text-[2rem] prose-h1:md:text-[2.5rem]
              prose-h2:text-[1.5rem] prose-h2:md:text-[1.875rem]
              prose-h3:text-[1.25rem] prose-h3:md:text-[1.5rem]
              prose-p:text-[#69757A] prose-p:text-[15px] prose-p:font-medium prose-p:leading-[170%]
              prose-p:font-inter
              prose-a:text-[#E85C2B] prose-a:underline
              prose-strong:text-[#130A09]
              prose-ul:text-[#69757A] prose-ol:text-[#69757A]
              prose-li:text-[15px] prose-li:font-inter
              prose-img:rounded-[16px] prose-img:md:rounded-[24px]
              prose-blockquote:border-l-[#E85C2B] prose-blockquote:text-[#69757A]
              prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            "
          />
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="max-w-[900px] mx-auto border-t border-gray-200 pt-8">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tagItem, index) => (
                tagItem.tag && (
                  <span
                    key={tagItem.id || index}
                    className="px-3 py-1 bg-gray-100 text-[#69757A] text-sm rounded-full font-inter"
                  >
                    {tagItem.tag}
                  </span>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </Padding>
  );
};

export default SingleBlogContent;
