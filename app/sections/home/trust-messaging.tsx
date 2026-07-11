"use client";

import { useReveal } from "@/components/animations/use-reveal";
import { TRUST_MESSAGING_ITEMS } from "@/lib/marketing/constants";

const TrustMessaging = () => {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.08, y: 24, start: "top 85%" });

  return (
    <section className="landing-section border-t border-line bg-white">
      <div ref={ref} className="landing-container">
        <div data-reveal className="mb-8 max-w-[620px] sm:mb-10 md:mb-12">
          <span className="landing-tag">Why trust Fail2Fix</span>
          <h2 className="landing-heading">
            A managed MOT repair service you can rely on.
          </h2>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {TRUST_MESSAGING_ITEMS.map((item) => (
            <li
              key={item}
              data-reveal
              className="flex items-start gap-3 rounded-[14px] border border-line bg-cream/40 px-4 py-4 sm:px-5 sm:py-[18px]"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-amber"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-[0.88rem] font-semibold leading-snug text-navy sm:text-[0.92rem]">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TrustMessaging;
