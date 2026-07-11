"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/animations/gsap-setup";

const activities = [
  { name: "Sarah K.", city: "Leeds", action: "booked a brake repair" },
  { name: "Dan M.", city: "Birmingham", action: "compared 4 garage quotes" },
  { name: "Ravi P.", city: "Manchester", action: "fixed an exhaust failure" },
  { name: "Emma T.", city: "Bristol", action: "checked their MOT failure" },
  { name: "James L.", city: "Glasgow", action: "saved £112 vs dealer quote" },
  { name: "Priya S.", city: "London", action: "booked a same-week slot" },
];

const ActivityTicker = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-activity-item]");
        if (items.length < 2) return;

        gsap.set(items, { opacity: 0, y: 12 });
        gsap.set(items[0], { opacity: 1, y: 0 });

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
        items.forEach((item, i) => {
          const next = items[(i + 1) % items.length];
          tl.to(item, { opacity: 0, y: -10, duration: 0.35, ease: "power2.in" })
            .fromTo(
              next,
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
              "-=0.1",
            )
            .to({}, { duration: 2.8 });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="border-y border-line bg-navy py-3 text-cream sm:py-3.5"
    >
      <div className="landing-container flex items-center justify-center gap-3 sm:gap-4">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
        </span>
        <span className="font-jetbrains text-[0.68rem] tracking-[0.08em] text-amber uppercase sm:text-[0.72rem]">
          Live activity
        </span>
        <div className="relative h-6 min-w-0 flex-1 overflow-hidden sm:h-7">
          {activities.map((item, i) => (
            <p
              key={`${item.name}-${item.city}`}
              data-activity-item
              className={`absolute inset-0 flex items-center truncate text-[0.82rem] text-cream/85 sm:text-[0.9rem] ${
                i === 0 ? "opacity-100" : "opacity-0"
              }`}
            >
              <strong className="mr-1 font-semibold text-cream">
                {item.name}
              </strong>
              in {item.city} {item.action}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivityTicker;
