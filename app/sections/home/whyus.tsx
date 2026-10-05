"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/animations/gsap-setup";
import { WHY_CHOOSE_ITEMS } from "@/lib/marketing/constants";

const icons = [
  <svg key="0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
  <svg key="1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v20M17 7H7M17 12H7M17 17H7" />
  </svg>,
  <svg key="2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12h18M3 12l4-4M3 12l4 4" />
  </svg>,
  <svg key="3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>,
  <svg key="4" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 8v4l3 3" />
    <circle cx="12" cy="12" r="9" />
  </svg>,
  <svg key="5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v20M2 12h20" />
  </svg>,
  <svg key="6" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>,
  <svg key="7" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>,
];

const Whyus = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-why-card]");
        if (!cards.length) return;

        gsap.from(cards, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.08,
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
            rotY(px * 12);
            rotX(-py * 12);
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
      className="landing-section border-y border-line bg-white"
    >
      <div className="landing-container">
        <div className="mb-8 max-w-[620px] sm:mb-10 md:mb-12">
          <span className="landing-tag">Why Fail2Fix</span>
          <h2 className="landing-heading">Why Choose Fail2Fix?</h2>
          <p className="mt-3 text-[0.92rem] text-landing-slate sm:text-[0.98rem]">
            The UK&apos;s #1 managed MOT repair service — we handle everything so
            you don&apos;t have to.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {WHY_CHOOSE_ITEMS.map((card, index) => (
            <div
              key={card.title}
              data-why-card
              style={{ transformStyle: "preserve-3d", perspective: 800 }}
              className="group rounded-[14px] border border-line bg-white p-5 transition-shadow duration-300 hover:shadow-[0_18px_40px_-18px_rgba(20,33,61,0.35)] sm:p-[22px]"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[9px] bg-navy text-amber transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 sm:mb-4">
                {icons[index]}
              </div>
              <h3 className="mb-1.5 font-inter text-[0.95rem] font-semibold text-navy sm:text-base">
                {card.title}
              </h3>
              <p className="text-[0.85rem] text-landing-slate sm:text-[0.88rem]">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Whyus;
