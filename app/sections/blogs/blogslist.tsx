"use client";

import GuideCard from "@/components/guidecard";
import {
  useRegularBlogs,
  getFeaturedImageUrl,
  getAuthorName,
  formatBlogDate,
  getBlogExcerpt,
} from "@/hooks/use-blogs";

const Blogslist = () => {
  const { data, isLoading, error } = useRegularBlogs({ limit: 20 });

  if (!isLoading && (!data || data.docs.length === 0)) {
    return null;
  }

  return (
    <section className="landing-section border-t border-line bg-white">
      <div className="landing-container">
        <div className="mb-8 max-w-[620px] sm:mb-10">
          <span className="landing-tag">All articles</span>
          <h2 className="landing-heading">Latest from the blog</h2>
          <p className="mt-3 text-[0.92rem] text-landing-slate sm:text-[0.98rem]">
            Decode your MOT failure, understand repair options, and get back on
            the road with confidence.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 max-md:grid-cols-1">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-[290px] rounded-[12px] bg-line md:h-[370px]" />
                <div className="space-y-3 p-6">
                  <div className="h-5 w-3/4 rounded bg-line" />
                  <div className="h-4 w-full rounded bg-line" />
                  <div className="h-4 w-2/3 rounded bg-line" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="py-10 text-center">
            <p className="text-landing-slate">
              Failed to load blogs. Please try again later.
            </p>
          </div>
        )}

        {data && data.docs.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 max-md:grid-cols-1">
            {data.docs.map((blog) => (
              <GuideCard
                fullWidth
                key={blog.id}
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
      </div>
    </section>
  );
};

export default Blogslist;
