"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/animations/gsap-setup";

const failures = [
  {
    title: "Brakes",
    description: "Pads, discs and brake fluid issues — the #1 MOT failure.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      </svg>
    ),
  },
  {
    title: "Tyres",
    description: "Tread depth, damage and pressure — quick and affordable fixes.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      </svg>
    ),
  },
  {
    title: "Lights",
    description: "Headlamps, indicators and alignment sorted in minutes.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18h6M10 21h4" />
        <path d="M12 3a6 6 0 00-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0012 3z" />
      </svg>
    ),
  },
  {
    title: "Suspension",
    description: "Worn shocks, springs and bushes that fail the MOT ride test.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 4v4M6 16v4M6 8c0 1.5 2 1.5 2 3s-2 1.5-2 3 2 1.5 2 3" />
        <path d="M14 4h4v16h-4z" />
      </svg>
    ),
  },
  {
    title: "Emissions",
    description: "Exhaust and emissions readings brought back within limits.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 16h12a3 3 0 003-3V9" />
        <path d="M18 6c1.5 0 1.5 2 3 2M18 10c1.5 0 1.5 2 3 2" />
        <circle cx="6" cy="16" r="2" />
        <circle cx="13" cy="16" r="2" />
      </svg>
    ),
  },
  {
    title: "Steering",
    description: "Play, leaks and tracking issues fixed by vetted specialists.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M12 9.5V3M9.8 13.5l-5.6 3.2M14.2 13.5l5.6 3.2" />
      </svg>
    ),
  },
];

const CommonFailures = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-fail-card]");
        if (!cards.length) return;

        gsap.from(cards, {
          opacity: 0,
          y: 34,
          scale: 0.96,
          duration: 0.55,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        });

        const cleanups = cards.map((card) => {
          const rotX = gsap.quickTo(card, "rotationX", {
            duration: 0.4,
            ease: "power2.out",
          });
          const rotY = gsap.quickTo(card, "rotationY", {
            duration: 0.4,
            ease: "power2.out",
          });
          const onMove = (e: MouseEvent) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            rotY(px * 10);
            rotX(-py * 10);
          };
          const onLeave = () => {
            rotX(0);
            rotY(0);
          };
          card.addEventListener("mousemove", onMove);
          card.addEventListener("mouseleave", onLeave);
          return () => {
            card.removeEventListener("mousemove", onMove);
            card.removeEventListener("mouseleave", onLeave);
          };
        });

        return () => cleanups.forEach((fn) => fn());
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="landing-section border-t border-line bg-cream"
    >
      <div className="landing-container">
        <div className="mb-8 max-w-[620px] sm:mb-10 md:mb-12">
          <span className="landing-tag">What we fix</span>
          <h2 className="landing-heading">
            The MOT failures we sort out every day.
          </h2>
          <p className="mt-2 text-[0.95rem] text-landing-slate sm:mt-3 sm:text-[1.02rem]">
            Whatever your certificate says, we&apos;ll explain it and get you a
            fair price to fix it.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {failures.map((item) => (
            <div
              key={item.title}
              data-fail-card
              style={{ transformStyle: "preserve-3d", perspective: 800 }}
              className="group flex items-start gap-4 rounded-[14px] border border-line bg-white p-5 transition-shadow duration-300 hover:shadow-[0_18px_44px_-20px_rgba(20,33,61,0.4)] sm:p-[22px]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-navy text-amber transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 [&_svg]:h-5 [&_svg]:w-5">
                {item.icon}
              </div>
              <div className="min-w-0">
                <h3 className="mb-1 font-fraunces text-[1.02rem] font-bold text-navy">
                  {item.title}
                </h3>
                <p className="text-[0.85rem] text-landing-slate sm:text-[0.88rem]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommonFailures;
