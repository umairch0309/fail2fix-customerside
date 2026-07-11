"use client";

import { useRef } from "react";
import { Phone } from "lucide-react";
import { useQuoteEntry } from "@/components/marketing/quote-entry-context";
import { PhoneLink } from "@/components/marketing/phone-link";
import { gsap, useGSAP } from "@/components/animations/gsap-setup";
import { BrandOrbGlow } from "@/components/animations/brand-orb-glow";
import { CollectionDisclaimer } from "@/components/marketing/collection-disclaimer";
import { PHONE_DISPLAY } from "@/lib/marketing/constants";

const Getaquote = () => {
  const { openQuoteModal } = useQuoteEntry();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-cta-band]", {
          opacity: 0,
          y: 36,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
        });
        gsap.to("[data-cta-glow]", {
          opacity: 0.55,
          scale: 1.15,
          repeat: -1,
          yoyo: true,
          duration: 3,
          ease: "sine.inOut",
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="landing-section">
      <div className="landing-container">
        <div
          data-cta-band
          className="relative grid w-full gap-6 overflow-hidden rounded-[16px] bg-navy px-4 py-8 text-cream sm:rounded-[20px] sm:px-8 sm:py-10 lg:gap-10 lg:px-12 lg:py-12"
        >
          <BrandOrbGlow variant="cta" />
          <div
            data-cta-glow
            aria-hidden="true"
            className="pointer-events-none absolute -top-1/2 -right-10 h-[320px] w-[320px] rounded-full opacity-25"
            style={{
              background:
                "radial-gradient(circle, rgba(255,140,50,0.55), transparent 70%)",
            }}
          />
          <div className="relative z-1 text-center lg:text-left">
            <h2 className="font-fraunces text-[1.35rem] leading-tight font-bold text-cream sm:text-[1.5rem] lg:text-[1.7rem]">
              Failed your MOT today?
            </h2>
            <p className="mt-3 max-w-[540px] text-[0.92rem] leading-relaxed text-cream/80 sm:text-[1rem] lg:mx-0 lg:text-left">
              We&apos;ll collect your vehicle. Manage the repair. Return it once
              complete. Arrange your MOT retest.
            </p>
            <CollectionDisclaimer className="mt-3 max-w-[540px] text-cream/55 lg:mx-0 lg:text-left" />
          </div>

          <div className="relative z-1 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-end">
            <PhoneLink
              source="final_cta"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber px-6 py-3.5 font-bold text-navy transition hover:bg-amber-dark sm:w-auto"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call {PHONE_DISPLAY}
            </PhoneLink>
            <button
              type="button"
              onClick={openQuoteModal}
              className="w-full cursor-pointer rounded-lg border border-cream/25 bg-cream/10 px-6 py-3.5 font-bold text-cream transition hover:bg-cream/15 sm:w-auto"
            >
              Check My MOT
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Getaquote;
