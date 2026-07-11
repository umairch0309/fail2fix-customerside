"use client";

import { useRef } from "react";
import { Phone } from "lucide-react";
import { gsap, useGSAP } from "@/components/animations/gsap-setup";
import { BrandOrbGlow } from "@/components/animations/brand-orb-glow";
import { PhoneLink } from "@/components/marketing/phone-link";
import { PHONE_DISPLAY } from "@/lib/marketing/constants";

interface MarketingPageHeroProps {
  tag: string;
  title: string;
  description?: string;
  showPhoneCta?: boolean;
}

export function MarketingPageHero({
  tag,
  title,
  description,
  showPhoneCta = false,
}: MarketingPageHeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-marketing-hero]", {
          opacity: 0,
          y: 28,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
        });

        gsap.to("[data-marketing-glow]", {
          opacity: 0.55,
          scale: 1.12,
          repeat: -1,
          yoyo: true,
          duration: 3.2,
          ease: "sine.inOut",
        });
      });
      return () => mm.revert();
    },
    { scope: heroRef },
  );

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-gradient-to-b from-navy to-navy-light px-4 py-14 text-center text-cream sm:px-6 sm:py-16 md:py-20"
    >
      <BrandOrbGlow variant="hero" />
      <div
        data-marketing-glow
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-[280px] w-[280px] -translate-x-1/2 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(255,140,50,0.4), transparent 70%)",
        }}
      />
      <div className="landing-container relative z-1">
        <span data-marketing-hero className="landing-tag !text-amber">
          {tag}
        </span>
        <h1
          data-marketing-hero
          className="font-fraunces text-[2rem] leading-tight font-bold text-cream sm:text-[2.4rem] md:text-[2.75rem]"
        >
          {title}
        </h1>
        {description ? (
          <p
            data-marketing-hero
            className="mx-auto mt-4 max-w-[640px] text-[0.95rem] leading-relaxed text-cream/80 sm:text-[1.02rem]"
          >
            {description}
          </p>
        ) : null}
        {showPhoneCta ? (
          <div data-marketing-hero className="mt-8">
            <PhoneLink
              source="marketing_page_hero"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber px-6 py-3.5 font-bold text-navy transition hover:bg-amber-dark"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call {PHONE_DISPLAY}
            </PhoneLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
