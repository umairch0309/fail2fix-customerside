"use client";

import { useReveal } from "@/components/animations/use-reveal";
import { FAQ_ITEMS } from "@/lib/marketing/constants";

const Faqs = () => {
  const sectionRef = useReveal<HTMLElement>({
    y: 14,
    duration: 0.4,
    stagger: 0,
    start: "top bottom",
  });

  return (
    <section
      id="faqs"
      ref={sectionRef}
      className="landing-section border-t border-line bg-white"
    >
      <div className="landing-container">
        <div data-reveal className="mb-8 max-w-[620px] sm:mb-10 md:mb-12">
          <span className="landing-tag">Questions</span>
          <h2 className="landing-heading">Frequently asked questions</h2>
        </div>

        <div data-reveal className="w-full max-w-[760px]">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              open={"defaultOpen" in item ? item.defaultOpen : false}
              className="group border-b border-line py-4 sm:py-5"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 font-fraunces text-[0.98rem] font-semibold text-navy sm:items-center sm:text-[1.08rem] [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 pr-2">{item.question}</span>
                <span className="shrink-0 font-inter text-[1.3rem] font-normal text-amber-dark group-open:hidden sm:text-[1.4rem]">
                  +
                </span>
                <span className="hidden shrink-0 font-inter text-[1.3rem] font-normal text-amber-dark group-open:inline sm:text-[1.4rem]">
                  –
                </span>
              </summary>
              <p className="mt-2.5 max-w-[640px] text-[0.9rem] text-landing-slate sm:mt-3 sm:text-[0.95rem]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faqs;
