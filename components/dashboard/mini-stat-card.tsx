"use client";

import { motion } from "motion/react";
import { AnimatedNumber } from "./animated-number";

interface MiniStatCardProps {
  title: string;
  value: string | number;
  isLoading?: boolean;
  delay?: number;
}

export function MiniStatCard({ title, value, isLoading, delay = 0.1 }: MiniStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg border border-[#E4E7EE] border-t-[3px] border-t-[#14213d] p-3 md:p-6 h-full shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2 mb-2 md:mb-4">
        <span className="w-1.5 h-4 rounded-sm bg-[#ff8c32]" />
        <p className="text-sm font-medium text-[#14213d]">{title}</p>
      </div>
      <p
        className={`text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-[#14213d] ${
          isLoading ? "animate-pulse" : ""
        }`}
      >
        {isLoading ? (
          "..."
        ) : typeof value === "number" ? (
          <AnimatedNumber value={value} />
        ) : (
          value
        )}
      </p>
    </motion.div>
  );
}
