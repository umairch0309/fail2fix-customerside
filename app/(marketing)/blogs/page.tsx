"use client";

import Blogslist from "@/app/sections/blogs/blogslist";
import Guides from "@/app/sections/home/guides";
import { MarketingPageLayout } from "@/components/marketing/marketing-page-layout";
import { useBlogs } from "@/hooks/use-blogs";

const EmptyState = () => {
  return (
    <section className="landing-section border-t border-line bg-white">
      <div className="landing-container">
        <div className="mx-auto max-w-[560px] rounded-[16px] border border-line bg-cream/40 py-16 text-center">
          <h2 className="font-fraunces text-[1.5rem] font-bold text-navy sm:text-[1.75rem]">
            No blogs yet
          </h2>
          <p className="mt-3 text-[0.92rem] leading-relaxed text-landing-slate">
            We&apos;re working on guides and tips about MOT repairs and car
            maintenance. Check back soon.
          </p>
        </div>
      </div>
    </section>
  );
};

const BlogsPage = () => {
  const { data, isLoading } = useBlogs({ limit: 1 });
  const hasNoBlogs = !isLoading && (!data || data.totalDocs === 0);

  return (
    <MarketingPageLayout
      tag="Guides"
      title="MOT guides & blog"
      description="Practical advice on MOT failures, repairs, and getting back on the road — from the Fail2Fix team."
    >
      {hasNoBlogs ? (
        <EmptyState />
      ) : (
        <>
          <Guides />
          <Blogslist />
        </>
      )}
    </MarketingPageLayout>
  );
};

export default BlogsPage;
