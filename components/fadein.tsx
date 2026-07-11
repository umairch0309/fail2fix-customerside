"use client";
import React, { useRef, ReactNode } from "react";
import { motion, useInView, cubicBezier } from "framer-motion";

interface FadeinProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

const Fadein: React.FC<FadeinProps> = ({
  children,
  delay = 0,
  duration = 0.3,
  once = true,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{
        duration,
        delay,
        ease: cubicBezier(0.83, 0, 0.17, 1),
      }}
    >
      {children}
    </motion.div>
  );
};

export default Fadein;
