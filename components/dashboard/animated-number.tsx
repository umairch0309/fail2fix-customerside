"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "motion/react";

interface AnimatedNumberProps {
  value: number;
}

/** Counts up to `value` with a spring; falls back to plain text for SSR. */
export function AnimatedNumber({ value }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 28, stiffness: 120 });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString();
      }
    });
  }, [spring]);

  return <span ref={ref}>{value.toLocaleString()}</span>;
}
