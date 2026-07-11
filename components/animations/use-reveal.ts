"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap-setup";

interface RevealOptions {
  /** CSS selector (scoped to the returned ref) for the elements to reveal. */
  selector?: string;
  /** Vertical offset the elements animate up from. */
  y?: number;
  duration?: number;
  stagger?: number;
  /** ScrollTrigger `start` value. */
  start?: string;
}

/**
 * Scroll-triggered staggered fade/slide-up reveal.
 * Returns a ref to attach to the section wrapper; any descendant matching
 * `selector` (default `[data-reveal]`) is animated in on scroll.
 * Fully skipped for users who prefer reduced motion.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  opts: RevealOptions = {},
) {
  const ref = useRef<T>(null);
  const {
    selector = "[data-reveal]",
    y = 26,
    duration = 0.7,
    stagger = 0.12,
    start = "top 85%",
  } = opts;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = ref.current?.querySelectorAll(selector);
        if (!targets || targets.length === 0) return;

        gsap.from(targets, {
          opacity: 0,
          y,
          duration,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start,
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return ref;
}
