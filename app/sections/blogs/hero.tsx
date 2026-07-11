"use client";

import Fadein from "@/components/fadein";
import GuideCard from "@/components/guidecard";
import Padding from "@/components/padding";
import {
  useFeaturedBlogs,
  getFeaturedImageUrl,
  getAuthorName,
  formatBlogDate,
  getBlogExcerpt,
} from "@/hooks/use-blogs";
import type { Blog } from "@/types/blog";

const Hero = () => {
  const { data: featuredBlogs, isLoading, error } = useFeaturedBlogs();

  // Don't render if no featured blogs
  if (!isLoading && (!featuredBlogs || featuredBlogs.length === 0)) {
    return null;
  }

  const renderFeaturedLayout = (blogs: Blog[]) => {
    const count = blogs.length;

    if (count === 1) {
      // 1 featured: full width
      const blog = blogs[0];
      return (
        <div className="grid grid-cols-1 gap-4 mt-8">
          <GuideCard
            fullWidth
            className="col-span-1"
            className1="object-cover"
            image={getFeaturedImageUrl(blog.featuredImage)}
            title={blog.title}
            description={getBlogExcerpt(blog)}
            username={getAuthorName(blog.author)}
            date={formatBlogDate(blog.publishedDate)}
            href={`/blogs/${blog.slug}`}
          />
        </div>
      );
    }

    if (count === 2) {
      // 2 featured: 2 equal columns
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {blogs.map((blog) => (
            <GuideCard
              key={blog.id}
              fullWidth
              className1="object-cover"
              image={getFeaturedImageUrl(blog.featuredImage)}
              title={blog.title}
              description={getBlogExcerpt(blog)}
              username={getAuthorName(blog.author)}
              date={formatBlogDate(blog.publishedDate)}
              href={`/blogs/${blog.slug}`}
            />
          ))}
        </div>
      );
    }

    // 3+ featured: 1 big (latest) + 2 small, then continue with grid
    const [first, second, third, ...rest] = blogs;

    return (
      <>
        <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 mt-8">
          {/* First (latest) - big card spanning 2 columns */}
          <GuideCard
            fullWidth
            className="col-span-2"
            className1="object-cover"
            image={getFeaturedImageUrl(first.featuredImage)}
            title={first.title}
            description={getBlogExcerpt(first)}
            username={getAuthorName(first.author)}
            date={formatBlogDate(first.publishedDate)}
            href={`/blogs/${first.slug}`}
          />
          {/* Second card */}
          <GuideCard
            fullWidth
            className1="object-cover"
            image={getFeaturedImageUrl(second.featuredImage)}
            title={second.title}
            description={getBlogExcerpt(second)}
            username={getAuthorName(second.author)}
            date={formatBlogDate(second.publishedDate)}
            href={`/blogs/${second.slug}`}
          />
          {/* Third card */}
          <GuideCard
            fullWidth
            className1="object-cover"
            image={getFeaturedImageUrl(third.featuredImage)}
            title={third.title}
            description={getBlogExcerpt(third)}
            username={getAuthorName(third.author)}
            date={formatBlogDate(third.publishedDate)}
            href={`/blogs/${third.slug}`}
          />
        </div>

        {/* Additional featured blogs in regular grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {rest.map((blog) => (
              <GuideCard
                key={blog.id}
                fullWidth
                className1="object-cover"
                image={getFeaturedImageUrl(blog.featuredImage)}
                title={blog.title}
                description={getBlogExcerpt(blog)}
                username={getAuthorName(blog.author)}
                date={formatBlogDate(blog.publishedDate)}
                href={`/blogs/${blog.slug}`}
              />
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <Padding className="pt-32 pb-10">
      <div className="max-w-[1700px] mx-auto">
        <div className="">
          <Fadein>
            <h6 className="text-[1rem] font-polysanstrial text-[#615C58]">
              Updates
            </h6>
            <h2 className="text-[#130A09] font-semibold text-[1.75rem] md:text-[2rem] lg:text-[2.38rem] tracking-tight font-polysanstrial">
              Guides and blogs
            </h2>
            <p className="text-[#7E7E7E] uppercase max-w-[450px] text-[0.85rem]">
              Get latest updates, news, guides about cars, Garages etc.
            </p>
          </Fadein>

          {isLoading && (
            <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 mt-8">
              {/* Loading skeleton for big card */}
              <div className="col-span-2 animate-pulse">
                <div className="bg-gray-200 h-[290px] md:h-[370px] rounded-[12px]" />
                <div className="p-6 space-y-3">
                  <div className="bg-gray-200 h-5 w-3/4 rounded" />
                  <div className="bg-gray-200 h-4 w-full rounded" />
                </div>
              </div>
              {/* Loading skeleton for small cards */}
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-[290px] md:h-[370px] rounded-[12px]" />
                  <div className="p-6 space-y-3">
                    <div className="bg-gray-200 h-5 w-3/4 rounded" />
                    <div className="bg-gray-200 h-4 w-full rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-8 text-center py-10">
              <p className="text-red-500">Failed to load featured blogs.</p>
            </div>
          )}

          {featuredBlogs && featuredBlogs.length > 0 && renderFeaturedLayout(featuredBlogs)}
        </div>
      </div>
    </Padding>
  );
};

export default Hero;
