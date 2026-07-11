"use client";

import { useRef } from "react";
import { Phone } from "lucide-react";
import { useQuoteEntry } from "@/components/marketing/quote-entry-context";
import { PlateInput } from "@/components/marketing/plate-input";
import { PhoneLink } from "@/components/marketing/phone-link";
import { gsap, useGSAP } from "@/components/animations/gsap-setup";
import { BrandOrbGlow } from "@/components/animations/brand-orb-glow";
import OrbitField from "@/components/animations/orbit-field";
import {
  PAYMENT_ASSIST_TAGLINE,
  PHONE_DISPLAY,
  TRUST_MESSAGING_ITEMS,
} from "@/lib/marketing/constants";

const trustIcons = [
  (
    <svg key="0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  (
    <svg key="1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  (
    <svg key="2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M17 7H7M17 12H7M17 17H7" />
    </svg>
  ),
];

const heroTrustItems = [
  TRUST_MESSAGING_ITEMS[0],
  TRUST_MESSAGING_ITEMS[2],
  TRUST_MESSAGING_ITEMS[1],
];

const Hero = () => {
  const { vrm, setVrm, openQuoteModal } = useQuoteEntry();
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: 0.7 },
        });
        tl.from("[data-hero-copy]", {
          opacity: 0,
          y: 28,
          stagger: 0.12,
        }).from(
          "[data-hero-card]",
          { opacity: 0, y: 36, scale: 0.97, duration: 0.8 },
          "-=0.5",
        );

        gsap.to("[data-hero-card]", {
          y: -10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 3.5,
          delay: 1,
        });

        const onMove = (e: MouseEvent) => {
          const { innerWidth, innerHeight } = window;
          const x = (e.clientX / innerWidth - 0.5) * 40;
          const y = (e.clientY / innerHeight - 0.5) * 40;
          gsap.to(glowRef.current, {
            x,
            y,
            duration: 0.8,
            ease: "power2.out",
          });
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-x-clip bg-gradient-to-b from-navy to-navy-light pt-8 pb-12 text-cream sm:pt-14 sm:pb-20 md:pt-16 md:pb-24 lg:pt-20 lg:pb-28"
    >
      <OrbitField />
      <BrandOrbGlow variant="hero" />
      <div
        ref={glowRef}
        className="pointer-events-none absolute -top-16 right-0 h-[240px] w-[240px] translate-x-1/4 rounded-full sm:h-[320px] sm:w-[320px] lg:h-[480px] lg:w-[480px] lg:translate-x-0"
        style={{
          background:
            "radial-gradient(circle, rgba(255,140,50,0.16), transparent 70%)",
        }}
      />

      <div className="landing-container relative z-2 min-w-0">
        <div className="grid min-w-0 items-center gap-6 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div
            data-hero-card
            className="glow-amber order-1 w-full min-w-0 max-w-full rounded-[14px] bg-cream p-4 text-navy shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)] sm:rounded-[18px] sm:p-6 md:p-7 lg:order-2"
          >
            <h3 className="mb-1 font-fraunces text-[1rem] font-bold sm:text-[1.05rem]">
              Check your MOT failure
            </h3>
            <p className="mb-4 text-[0.82rem] text-landing-slate sm:mb-5 sm:text-[0.85rem]">
              Free, instant, no obligation to book.
            </p>

            <PlateInput value={vrm} onChange={setVrm} />

            <button
              type="button"
              onClick={openQuoteModal}
              className="mt-3 w-full cursor-pointer rounded-lg bg-amber py-3.5 text-[0.95rem] font-bold text-navy transition hover:-translate-y-px hover:bg-amber-dark sm:mt-3.5 sm:py-[15px] sm:text-base"
            >
              Get my repair quote →
            </button>

            <p className="mt-2 text-center text-[0.75rem] text-landing-slate sm:mt-2.5 sm:text-[0.78rem]">
              Takes 60 seconds · No card required
            </p>

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-navy/5 p-3 text-[0.8rem] text-navy sm:mt-[18px] sm:gap-2.5 sm:p-3.5 sm:text-[0.83rem]">
              <span className="shrink-0">💷</span>
              <span>
                You only pay a 10% deposit to book a repair. The rest is paid
                once your car&apos;s fixed — never before.
              </span>
            </div>

            <p className="mt-3 text-center text-[0.72rem] leading-relaxed text-landing-slate sm:text-[0.76rem]">
              {PAYMENT_ASSIST_TAGLINE}
            </p>

            <div className="mt-4 border-t border-line pt-4 text-center sm:mt-5 sm:pt-5">
              <p className="text-[0.8rem] font-medium text-landing-slate sm:text-[0.85rem]">
                Prefer to speak to someone?
              </p>
              <PhoneLink
                source="hero_card"
                className="mt-1.5 inline-flex items-center justify-center gap-1.5 font-fraunces text-[1.05rem] font-bold text-navy transition hover:text-amber-dark sm:text-[1.1rem]"
              >
                <Phone className="h-4 w-4 text-amber" aria-hidden="true" />
                {PHONE_DISPLAY}
              </PhoneLink>
              <p className="mt-1 text-[0.78rem] text-landing-slate sm:text-[0.82rem]">
                Speak directly to an MOT Repair Specialist
              </p>
            </div>
          </div>

          <div className="order-2 min-w-0 lg:order-1">
            <span
              data-hero-copy
              className="mb-3 inline-flex items-center gap-2 font-jetbrains text-[0.7rem] tracking-[0.08em] text-amber uppercase before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-amber before:content-[''] sm:mb-[18px] sm:text-[0.75rem]"
            >
              UK&apos;s managed MOT repair service
            </span>

            <h1
              data-hero-copy
              className="mb-4 font-fraunces text-[1.85rem] leading-[1.1] font-bold sm:mb-[18px] sm:text-[2.2rem] sm:leading-[1.07] md:text-4xl lg:text-5xl"
            >
              Failed your MOT?
              <br />
              <em className="gradient-text font-medium not-italic">
                Know the cost
              </em>{" "}
              in 60 seconds.
            </h1>

            <p
              data-hero-copy
              className="mb-5 max-w-[480px] text-base text-cream/82 sm:mb-7 sm:text-[1.13rem]"
            >
              Enter your reg to see what failed and get upfront repair pricing.
              We collect your vehicle, manage the repair, and return it once
              complete — no hassle, no guesswork.
            </p>

            <div
              data-hero-copy
              className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3"
            >
              {heroTrustItems.map((label, index) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 text-[0.8rem] text-cream/75 sm:text-[0.85rem]"
                >
                  <span className="shrink-0 text-amber">
                    {trustIcons[index] ?? trustIcons[0]}
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
