"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/components/animations/gsap-setup";
import { BrandOrbGlow } from "@/components/animations/brand-orb-glow";
import { useReveal } from "@/components/animations/use-reveal";
import { CollectionDisclaimer } from "@/components/marketing/collection-disclaimer";
import {
  LocationFinalCta,
  LocationQuoteCta,
} from "@/components/marketing/location-cta";
import { PhoneLink } from "@/components/marketing/phone-link";
import {
  getLocationUrl,
  LOCATION_FAQS,
  LOCATION_SERVICE_STEPS,
} from "@/lib/marketing/locations";
import type { LocationPageData } from "@/lib/marketing/locations/types";
import {
  PAYMENT_ASSIST_TAGLINE,
  PHONE_DISPLAY,
} from "@/lib/marketing/constants";

const internalLinks = [
  { href: "/", label: "Homepage" },
  { href: "/howitworks", label: "How it works" },
  { href: "/#payment-assist", label: "Payment Assist" },
  { href: "/#collection-delivery", label: "Free collection & delivery" },
  { href: "/contact", label: "Contact" },
  { href: "/#faqs", label: "FAQs" },
];

interface LocationPageClientProps {
  page: LocationPageData;
}

export function LocationPageClient({ page }: LocationPageClientProps) {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useReveal<HTMLDivElement>({
    selector: "[data-location-section]",
    stagger: 0.1,
    y: 24,
    start: "top 88%",
  });
  const ctaRef = useReveal<HTMLDivElement>({ y: 32, duration: 0.8, start: "top 88%" });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-location-hero]", {
          opacity: 0,
          y: 28,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
        });

        gsap.to("[data-location-glow]", {
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
    <div className="min-h-screen bg-cream">
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-b from-navy to-navy-light px-4 py-14 text-center text-cream sm:px-6 sm:py-16 md:py-20"
      >
        <BrandOrbGlow variant="hero" />
        <div
          data-location-glow
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-[280px] w-[280px] -translate-x-1/2 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(255,140,50,0.4), transparent 70%)",
          }}
        />
        <div className="landing-container relative z-1">
          <span data-location-hero className="landing-tag !text-amber">
            MOT Repairs
          </span>
          <h1
            data-location-hero
            className="font-fraunces text-[2rem] leading-tight font-bold text-cream sm:text-[2.4rem] md:text-[2.75rem]"
          >
            {page.h1}
          </h1>
          <p
            data-location-hero
            className="mx-auto mt-4 max-w-[640px] text-[0.95rem] leading-relaxed text-cream/80 sm:text-[1.02rem]"
          >
            {page.intro}
          </p>
          <div data-location-hero className="mt-8">
            <LocationQuoteCta />
          </div>
        </div>
      </section>

      <section className="landing-section !pt-10 sm:!pt-12 md:!pt-14">
        <div className="landing-container">
          <div ref={contentRef} className="mx-auto max-w-[820px] space-y-10">
            <article
              data-location-section
              className="rounded-[16px] border border-line bg-white p-6 shadow-[0_8px_32px_-12px_rgba(20,33,61,0.12)] sm:rounded-[20px] sm:p-8 md:p-10"
            >
              <div className="legal-prose space-y-10">
                <section className="space-y-3">
                  <h2 className="font-fraunces text-[1.15rem] font-bold text-navy sm:text-[1.25rem]">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber" />
                    Local coverage
                  </h2>
                  <p className="text-[0.9rem] leading-relaxed text-landing-slate sm:text-[0.95rem]">
                    {page.coverage}
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-fraunces text-[1.15rem] font-bold text-navy sm:text-[1.25rem]">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber" />
                    What makes Fail2Fix different in {page.name}
                  </h2>
                  <p className="text-[0.9rem] leading-relaxed text-landing-slate sm:text-[0.95rem]">
                    {page.differentiator}
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-fraunces text-[1.15rem] font-bold text-navy sm:text-[1.25rem]">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber" />
                    Common MOT repairs in {page.name}
                  </h2>
                  <ul className="list-disc space-y-2 pl-5 text-[0.9rem] leading-relaxed text-landing-slate sm:text-[0.95rem]">
                    {page.commonRepairs.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="text-[0.88rem] leading-relaxed text-landing-slate sm:text-[0.92rem]">
                    {page.commonRepairsNote}
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-fraunces text-[1.15rem] font-bold text-navy sm:text-[1.25rem]">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber" />
                    How the service works
                  </h2>
                  <ol className="list-decimal space-y-2 pl-5 text-[0.9rem] leading-relaxed text-landing-slate sm:text-[0.95rem]">
                    {LOCATION_SERVICE_STEPS.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </section>

                <section className="space-y-3">
                  <h2 className="font-fraunces text-[1.15rem] font-bold text-navy sm:text-[1.25rem]">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber" />
                    Why drivers in {page.name} need a fast repair route
                  </h2>
                  <p className="text-[0.9rem] leading-relaxed text-landing-slate sm:text-[0.95rem]">
                    {page.whyLocal}
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-fraunces text-[1.15rem] font-bold text-navy sm:text-[1.25rem]">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber" />
                    Free collection and delivery
                  </h2>
                  <p className="text-[0.9rem] leading-relaxed text-landing-slate sm:text-[0.95rem]">
                    {page.collectionCopy}
                  </p>
                  <CollectionDisclaimer />
                </section>

                <section className="space-y-3">
                  <h2 className="font-fraunces text-[1.15rem] font-bold text-navy sm:text-[1.25rem]">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber" />
                    Payment Assist
                  </h2>
                  <p className="text-[0.9rem] leading-relaxed text-landing-slate sm:text-[0.95rem]">
                    {page.paymentAssistCopy}
                  </p>
                  <p className="text-[0.88rem] leading-relaxed text-landing-slate sm:text-[0.92rem]">
                    {PAYMENT_ASSIST_TAGLINE}
                  </p>
                </section>

                <div className="brand-callout rounded-[12px] border border-amber/30 bg-amber/5 p-5 sm:p-6">
                  <p className="text-[0.9rem] leading-relaxed text-navy sm:text-[0.95rem]">
                    {page.aioSummary}
                  </p>
                </div>
              </div>
            </article>

            <section
              data-location-section
              className="rounded-[16px] border border-line bg-white p-6 sm:rounded-[20px] sm:p-8"
            >
              <h2 className="font-fraunces text-[1.15rem] font-bold text-navy sm:text-[1.25rem]">
                Frequently asked questions
              </h2>
              <div className="mt-4 w-full">
                {LOCATION_FAQS.map((item) => (
                  <details
                    key={item.question}
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
            </section>

            <section
              data-location-section
              className="rounded-[16px] border border-line bg-white p-6 sm:rounded-[20px] sm:p-8"
            >
              <h2 className="font-fraunces text-[1.15rem] font-bold text-navy sm:text-[1.25rem]">
                Nearby areas
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {page.nearbyAreas.map((area) => (
                  <li key={area.name}>
                    {area.slug ? (
                      <Link
                        href={getLocationUrl(area.slug)}
                        className="inline-flex rounded-full border border-line bg-cream/60 px-3.5 py-2 text-[0.82rem] font-medium text-navy transition hover:-translate-y-0.5 hover:border-amber/50 hover:bg-amber/10 hover:shadow-[0_4px_12px_rgba(255,140,50,0.15)] sm:text-[0.85rem]"
                      >
                        {area.name}
                      </Link>
                    ) : (
                      <span className="inline-flex rounded-full border border-line bg-cream/60 px-3.5 py-2 text-[0.82rem] font-medium text-navy/70 sm:text-[0.85rem]">
                        {area.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <nav
              data-location-section
              aria-label="Related pages"
              className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[0.85rem] text-landing-slate sm:text-[0.88rem]"
            >
              {internalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-amber-dark hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-container">
          <div
            ref={ctaRef}
            data-reveal
            className="relative grid w-full gap-6 overflow-hidden rounded-[16px] bg-navy px-4 py-8 text-cream sm:rounded-[20px] sm:px-8 sm:py-10 lg:gap-10 lg:px-12 lg:py-12"
          >
            <BrandOrbGlow variant="cta" />
            <div className="relative z-1 text-center lg:text-left">
              <h2 className="font-fraunces text-[1.35rem] leading-tight font-bold text-cream sm:text-[1.5rem] lg:text-[1.7rem]">
                Failed your MOT in {page.name}?
              </h2>
              <p className="mt-3 max-w-[540px] text-[0.92rem] leading-relaxed text-cream/80 sm:text-[1rem] lg:mx-0 lg:text-left">
                Get a repair quote, arrange booking support, and use free local
                collection where available. Call{" "}
                <PhoneLink
                  source="location_final_cta_inline"
                  className="font-semibold text-amber hover:text-amber-dark"
                >
                  {PHONE_DISPLAY}
                </PhoneLink>{" "}
                or enter your registration above.
              </p>
              <CollectionDisclaimer className="mt-3 max-w-[540px] text-cream/55 lg:mx-0 lg:text-left" />
            </div>
            <div className="relative z-1 lg:flex lg:justify-end">
              <LocationFinalCta />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
