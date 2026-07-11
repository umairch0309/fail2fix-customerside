"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/animations/gsap-setup";
import OrbitField from "@/components/animations/orbit-field";

const stats = [
  {
    prefix: "",
    value: 14200,
    suffix: "+",
    label: "MOT failures fixed",
    ring: 92,
  },
  {
    prefix: "",
    value: 340,
    suffix: "+",
    label: "vetted garages",
    ring: 88,
  },
  {
    prefix: "£",
    value: 89,
    suffix: "",
    label: "avg. saved vs dealer",
    ring: 76,
  },
  {
    prefix: "",
    value: 4.9,
    suffix: "/5",
    label: "average driver rating",
    ring: 98,
  },
];

const garages = [
  "AutoCare MOT Centre",
  "Premier Tyres & Servicing",
  "CityDrive Garage",
  "Halsey Motors",
  "GreenLane Autos",
  "RapidFix Servicing",
  "Northgate Vehicle Care",
  "Elite Auto Repairs",
];

const formatValue = (n: number, decimals: number) =>
  n.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const RING_SIZE = 72;
const RING_R = 30;
const RING_C = 2 * Math.PI * RING_R;

const StatsBand = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-stat]", {
          opacity: 0,
          y: 28,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        });

        sectionRef.current
          ?.querySelectorAll<HTMLElement>("[data-stat-value]")
          .forEach((el) => {
            const target = Number(el.dataset.statValue);
            const decimals = Number(el.dataset.decimals) || 0;
            const proxy = { val: 0 };
            gsap.to(proxy, {
              val: target,
              duration: 1.6,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 88%" },
              onUpdate: () => {
                el.textContent = formatValue(proxy.val, decimals);
              },
            });
          });

        sectionRef.current
          ?.querySelectorAll<SVGCircleElement>("[data-stat-ring]")
          .forEach((ring) => {
            const pct = Number(ring.dataset.statRing) / 100;
            gsap.fromTo(
              ring,
              { strokeDashoffset: RING_C },
              {
                strokeDashoffset: RING_C * (1 - pct),
                duration: 1.4,
                ease: "power2.out",
                scrollTrigger: { trigger: ring, start: "top 88%" },
              },
            );
          });

        const track = marqueeRef.current?.querySelector<HTMLElement>(
          "[data-marquee-track]",
        );
        if (track && marqueeRef.current) {
          const tween = gsap.to(track, {
            xPercent: -50,
            repeat: -1,
            duration: 28,
            ease: "none",
          });
          marqueeRef.current.addEventListener("mouseenter", () =>
            tween.timeScale(2.2),
          );
          marqueeRef.current.addEventListener("mouseleave", () =>
            tween.timeScale(1),
          );
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        sectionRef.current
          ?.querySelectorAll<SVGCircleElement>("[data-stat-ring]")
          .forEach((ring) => {
            const pct = Number(ring.dataset.statRing) / 100;
            gsap.set(ring, { strokeDashoffset: RING_C * (1 - pct) });
          });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="aurora-bg relative overflow-hidden text-cream"
    >
      <OrbitField className="opacity-70" />

      <div className="landing-container relative z-1 py-14 sm:py-16 md:py-20">
        <div className="mb-10 max-w-[620px] sm:mb-12">
          <span className="landing-tag !text-amber">By the numbers</span>
          <h2 className="font-fraunces text-[1.65rem] leading-[1.15] font-bold text-cream sm:text-[1.85rem] md:text-[2.1rem]">
            Thousands of drivers back on the road — without the dealer markup.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-4">
          {stats.map((stat) => {
            const decimals = Number.isInteger(stat.value) ? 0 : 1;
            return (
              <div
                key={stat.label}
                data-stat
                className="glass-card flex flex-col items-center rounded-[16px] p-5 text-center sm:p-6"
              >
                <div className="relative mb-3 flex h-[72px] w-[72px] items-center justify-center">
                  <svg
                    className="absolute inset-0 -rotate-90"
                    width={RING_SIZE}
                    height={RING_SIZE}
                    viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                    aria-hidden="true"
                  >
                    <circle
                      cx={RING_SIZE / 2}
                      cy={RING_SIZE / 2}
                      r={RING_R}
                      fill="none"
                      stroke="rgba(247,245,238,0.12)"
                      strokeWidth="4"
                    />
                    <circle
                      data-stat-ring={stat.ring}
                      cx={RING_SIZE / 2}
                      cy={RING_SIZE / 2}
                      r={RING_R}
                      fill="none"
                      stroke="#ff8c32"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={RING_C}
                      strokeDashoffset={RING_C}
                    />
                  </svg>
                  <span className="font-fraunces text-[1.1rem] leading-none font-bold sm:text-[1.25rem]">
                    <span className="gradient-text">
                      {stat.prefix}
                      <span
                        data-stat-value={stat.value}
                        data-decimals={decimals}
                      >
                        0
                      </span>
                      {stat.suffix}
                    </span>
                  </span>
                </div>
                <p className="text-[0.82rem] text-cream/70 sm:text-[0.9rem]">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-1 border-t border-cream/10 py-6">
        <p className="landing-container mb-4 font-jetbrains text-[0.7rem] tracking-[0.08em] text-cream/55 uppercase">
          Trusted by garages across the UK
        </p>
        <div ref={marqueeRef} className="marquee">
          <div
            data-marquee-track
            className="flex w-max gap-4 pr-4 motion-reduce:animate-none"
          >
            {[...garages, ...garages].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="flex shrink-0 items-center gap-2 rounded-full border border-cream/15 bg-cream/5 px-5 py-2.5 text-[0.85rem] font-medium whitespace-nowrap text-cream/80"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsBand;
