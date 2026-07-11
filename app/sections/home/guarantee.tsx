"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/animations/gsap-setup";

const promises = [
  {
    title: "No-obligation quotes",
    description: "Check what failed and see prices with zero pressure to book.",
  },
  {
    title: "Just 10% to book",
    description: "Pay a small deposit now, the rest only once your car passes.",
  },
  {
    title: "Vetted garages only",
    description: "Every garage is quality-checked before they join the network.",
  },
  {
    title: "Free re-test guidance",
    description: "We make sure your repair covers everything your MOT needs.",
  },
];

const Guarantee = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
          defaults: { ease: "power3.out" },
        });

        tl.from("[data-guarantee-head]", {
          opacity: 0,
          x: -30,
          duration: 0.6,
          stagger: 0.12,
        })
          .from(
            "[data-promise]",
            { opacity: 0, y: 24, duration: 0.5, stagger: 0.14 },
            "-=0.2",
          )
          .from(
            "[data-check]",
            {
              scale: 0,
              rotate: -120,
              duration: 0.5,
              stagger: 0.14,
              ease: "back.out(2.5)",
            },
            "<",
          );
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="landing-section">
      <div className="landing-container">
        <div className="aurora-bg relative overflow-hidden rounded-[20px] px-5 py-10 text-cream sm:px-8 sm:py-12 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:px-12 lg:py-14">
          <div className="mb-8 lg:mb-0">
            <span data-guarantee-head className="landing-tag !text-amber">
              Risk-free
            </span>
            <h2
              data-guarantee-head
              className="font-fraunces text-[1.6rem] leading-[1.15] font-bold text-cream sm:text-[1.85rem] md:text-[2.1rem]"
            >
              Booked with <span className="gradient-text">total confidence.</span>
            </h2>
            <p
              data-guarantee-head
              className="mt-3 max-w-[420px] text-[0.95rem] text-cream/75 sm:text-[1.02rem]"
            >
              No hidden fees, no surprise calls, no commitment until you&apos;re
              ready. Here&apos;s what every driver gets.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {promises.map((item) => (
              <div
                key={item.title}
                data-promise
                className="glass-card rounded-[14px] p-4 sm:p-5"
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <span
                    data-check
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber text-navy"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <h3 className="font-fraunces text-[0.98rem] font-bold text-cream">
                    {item.title}
                  </h3>
                </div>
                <p className="text-[0.83rem] leading-[1.5] text-cream/70">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Guarantee;
