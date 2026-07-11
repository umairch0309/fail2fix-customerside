"use client";

import Link from "next/link";
import { useReveal } from "@/components/animations/use-reveal";
import { CollectionDisclaimer } from "@/components/marketing/collection-disclaimer";
import { SERVICE_AREAS } from "@/lib/marketing/constants";
import { getLocationUrl, hasLocationPage } from "@/lib/marketing/locations";

const AreasWeCover = () => {
  const ref = useReveal<HTMLUListElement>({
    selector: "[data-area-chip]",
    stagger: 0.04,
    y: 16,
    duration: 0.55,
    start: "top 88%",
  });
  const headerRef = useReveal<HTMLDivElement>({ y: 24, start: "top 88%" });

  return (
    <section className="landing-section border-t border-line bg-white">
      <div className="landing-container">
        <div ref={headerRef} className="mb-8 max-w-[620px] sm:mb-10 md:mb-12">
          <div data-reveal>
            <span className="landing-tag">Areas we cover</span>
            <h2 className="landing-heading">Serving South London and beyond.</h2>
            <p className="mt-3 text-[0.92rem] text-landing-slate sm:text-[0.98rem]">
              Serving South London and surrounding areas with managed MOT
              repairs.
            </p>
            <CollectionDisclaimer className="mt-3" />
          </div>
        </div>

        <ul ref={ref} className="flex flex-wrap gap-2.5 sm:gap-3">
          {SERVICE_AREAS.map((area) => (
            <li key={area.slug} data-area-chip>
              {hasLocationPage(area.slug) ? (
                <Link
                  href={getLocationUrl(area.slug)}
                  className="inline-flex rounded-full border border-line bg-cream/60 px-3.5 py-2 text-[0.82rem] font-medium text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:bg-amber/10 hover:shadow-[0_4px_12px_rgba(20,33,61,0.08)] sm:text-[0.85rem]"
                >
                  {area.name}
                </Link>
              ) : (
                <span
                  data-slug={area.slug}
                  className="inline-flex cursor-default rounded-full border border-line bg-cream/60 px-3.5 py-2 text-[0.82rem] font-medium text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:bg-amber/10 hover:shadow-[0_4px_12px_rgba(20,33,61,0.08)] sm:text-[0.85rem]"
                >
                  {area.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AreasWeCover;
