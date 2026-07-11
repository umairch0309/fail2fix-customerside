"use client";

import { useReveal } from "@/components/animations/use-reveal";
import { TRUST_BAR_ITEMS } from "@/lib/marketing/constants";

const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const TrustBar = () => {
  const ref = useReveal<HTMLElement>({ stagger: 0.1, y: 18, start: "top 92%" });

  return (
    <section
      ref={ref}
      aria-label="Service guarantees"
      className="border-b border-line bg-white py-4 sm:py-5"
    >
      <div className="landing-container">
        <ul className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {TRUST_BAR_ITEMS.map((item) => (
            <li
              key={item}
              data-reveal
              className="flex min-w-[220px] shrink-0 items-center gap-2.5 rounded-[10px] border border-line bg-cream/50 px-4 py-3 sm:min-w-0"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-amber">
                <CheckIcon />
              </span>
              <span className="text-[0.85rem] font-semibold text-navy sm:text-[0.9rem]">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TrustBar;
