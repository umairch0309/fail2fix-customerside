"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap-setup";

interface OrbitFieldProps {
  className?: string;
}

/**
 * Decorative background layer of slowly revolving / orbiting objects
 * (gear, wrench, and orbiting accent dots). Purely cosmetic, non-interactive,
 * and motion is disabled for users who prefer reduced motion.
 */
const OrbitField: React.FC<OrbitFieldProps> = ({ className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-spin='cw']", {
          rotation: 360,
          repeat: -1,
          ease: "none",
          duration: 60,
          transformOrigin: "50% 50%",
        });
        gsap.to("[data-spin='ccw']", {
          rotation: -360,
          repeat: -1,
          ease: "none",
          duration: 45,
          transformOrigin: "50% 50%",
        });
        // Each orbit wrapper rotates, carrying its offset child around a circle.
        gsap.utils.toArray<HTMLElement>("[data-orbit]").forEach((el, i) => {
          gsap.to(el, {
            rotation: 360,
            repeat: -1,
            ease: "none",
            duration: 14 + i * 6,
            transformOrigin: "50% 50%",
          });
        });
        gsap.to("[data-float]", {
          y: -18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 4,
          stagger: 0.6,
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Large slow-revolving gear */}
      <svg
        data-spin="cw"
        className="absolute -top-16 -left-16 h-56 w-56 text-amber/10 sm:h-72 sm:w-72"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M54 6h-8l-1.6 8.2a36 36 0 00-7.7 3.2L30 12.4l-5.7 5.6 5 6.7a36 36 0 00-3.2 7.7L18 34v8l8.2 1.6a36 36 0 003.2 7.7l-5 6.7 5.7 5.6 6.7-5a36 36 0 007.7 3.2L46 70h8l1.6-8.2a36 36 0 007.7-3.2l6.7 5 5.7-5.6-5-6.7a36 36 0 003.2-7.7L82 42v-8l-8.2-1.6a36 36 0 00-3.2-7.7l5-6.7-5.7-5.6-6.7 5a36 36 0 00-7.7-3.2zM50 36a14 14 0 110 28 14 14 0 010-28z" />
      </svg>

      {/* Counter-rotating ring */}
      <svg
        data-spin="ccw"
        className="absolute -right-10 bottom-4 h-40 w-40 text-cream/8 sm:h-52 sm:w-52"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="10 14"
      >
        <circle cx="50" cy="50" r="44" />
      </svg>

      {/* Orbiting accent dots: wrapper rotates, dot sits on the rim */}
      <div
        data-orbit
        className="absolute top-1/3 left-1/4 h-48 w-48 sm:h-64 sm:w-64"
      >
        <span className="absolute top-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-amber/70 shadow-[0_0_18px_4px_rgba(255,140,50,0.45)]" />
      </div>
      <div
        data-orbit
        className="absolute right-1/4 bottom-1/4 h-32 w-32 sm:h-44 sm:w-44"
      >
        <span className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cream/60" />
      </div>

      {/* Floating soft blobs */}
      <span
        data-float
        className="absolute top-1/4 right-1/3 h-3 w-3 rounded-full bg-amber/40 blur-[1px]"
      />
      <span
        data-float
        className="absolute bottom-1/3 left-1/3 h-2 w-2 rounded-full bg-cream/40"
      />
    </div>
  );
};

export default OrbitField;
