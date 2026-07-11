"use client";

import { useReveal } from "@/components/animations/use-reveal";
import {
  TRUST_LOGOS,
} from "@/lib/marketing/constants";

const TrustLogos = () => {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.1, y: 22, start: "top 88%" });

  return (
    <section
      aria-label="Trusted partners"
      className="border-y border-line bg-cream py-8 sm:py-10"
    >
      <div ref={ref} className="landing-container">
        <p
          data-reveal
          className="mb-5 text-center font-jetbrains text-[0.72rem] tracking-[0.08em] text-landing-slate uppercase sm:mb-6"
        >
          Trusted partners &amp; secure payments
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {TRUST_LOGOS.map((logo) => (
            <li key={logo.id} data-reveal>
              <div className="grayscale transition hover:grayscale-0">
                <span className="flex flex-col items-center rounded-[10px] border border-line bg-white px-4 py-3 text-center transition hover:-translate-y-0.5 hover:border-navy/20 hover:shadow-[0_6px_16px_rgba(20,33,61,0.08)] sm:px-5 sm:py-3.5">
                  <span className="text-[0.82rem] font-semibold text-navy/80 sm:text-[0.88rem]">
                    {logo.label}
                  </span>
                  <span className="mt-0.5 text-[0.72rem] text-landing-slate sm:text-[0.78rem]">
                    {logo.sublabel}
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TrustLogos;
