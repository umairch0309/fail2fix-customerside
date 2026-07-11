"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import DragScrollContainer from "@/components/dragscrollcontainer";
import GuideCard from "@/components/guidecard";
import Fadein from "@/components/fadein";
import { ChevronRight } from "lucide-react";
import {
  useBlogs,
  getFeaturedImageUrl,
  getAuthorName,
  formatBlogDate,
  getBlogExcerpt,
} from "@/hooks/use-blogs";

const Guides: React.FC = () => {
  const [showCustomCursor, setShowCustomCursor] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const customCursorRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useBlogs({ limit: 8 });

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (customCursorRef.current) {
        customCursorRef.current.style.left = `${e.clientX}px`;
        customCursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    if (showCustomCursor && !isTouchDevice) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [showCustomCursor, isTouchDevice]);

  if (!isLoading && (!data || data.docs.length === 0)) {
    return null;
  }

  const hasMoreBlogs = data && data.totalDocs > 8;

  return (
    <section className="landing-section overflow-hidden border-t border-line bg-cream">
      <div className="landing-container">
        <Fadein className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 md:mb-10 md:flex-row md:items-end">
          <div className="max-w-[620px]">
            <span className="landing-tag">Guides</span>
            <h2 className="landing-heading">MOT Failure Guides & Advice</h2>
            <p className="mt-2 text-[0.95rem] text-landing-slate sm:mt-3 sm:text-[1.02rem]">
              Clear explanations, common fixes, and what to do after a failed
              MOT.
            </p>
          </div>
          {hasMoreBlogs && (
            <Link
              href="/blogs"
              className="hidden w-fit items-center gap-2 rounded-lg bg-amber px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-amber-dark md:inline-flex"
            >
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </Fadein>

        {!isTouchDevice && (
          <div
            ref={customCursorRef}
            className={`pointer-events-none fixed z-1000 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-sm font-medium text-white backdrop-blur-[2px] transition-opacity duration-200 ${
              showCustomCursor ? "opacity-100" : "opacity-0"
            }`}
          >
            <span>← drag →</span>
          </div>
        )}

        <div
          className="min-w-0 overflow-hidden"
          onMouseEnter={() => !isTouchDevice && setShowCustomCursor(true)}
          onMouseLeave={() => setShowCustomCursor(false)}
        >
          <Fadein>
            <DragScrollContainer>
              <div className="relative flex gap-3 sm:gap-4">
                {isLoading &&
                  [...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="min-w-[260px] max-w-[260px] shrink-0 animate-pulse sm:min-w-[300px] sm:max-w-[300px] md:min-w-[350px] md:max-w-[350px]"
                    >
                      <div className="h-[240px] rounded-[12px] bg-gray-200 sm:h-[290px] md:h-[370px]" />
                      <div className="space-y-3 p-4 sm:p-6">
                        <div className="h-5 w-3/4 rounded bg-gray-200" />
                        <div className="h-4 w-full rounded bg-gray-200" />
                        <div className="h-4 w-2/3 rounded bg-gray-200" />
                      </div>
                    </div>
                  ))}

                {data?.docs.map((blog) => (
                  <GuideCard
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
            </DragScrollContainer>
          </Fadein>
        </div>

        {hasMoreBlogs && (
          <div className="mt-5 md:hidden">
            <Link
              href="/blogs"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-amber-dark sm:w-auto"
            >
              View all blogs <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Guides;
