"use client";

import { cn } from "@/lib/utils";

interface PlateInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
  maxLength?: number;
  placeholder?: string;
  /** Use on navy/dark backgrounds (location hero, sticky bar). */
  tone?: "default" | "onDark";
}

export function PlateInput({
  value,
  onChange,
  className,
  inputClassName,
  maxLength = 8,
  placeholder = "AB12 CDE",
  tone = "default",
}: PlateInputProps) {
  const isOnDark = tone === "onDark";

  return (
    <div
      className={cn(
        "flex w-full overflow-hidden rounded-lg border-[3px]",
        isOnDark ? "border-cream/30" : "border-navy",
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 flex-col items-center justify-center px-2 py-0 font-inter text-[0.65rem] leading-tight font-bold sm:px-2.5 sm:text-[0.7rem]",
          isOnDark ? "bg-navy text-cream" : "bg-navy text-cream",
        )}
      >
        GB
        <span className="text-[0.85rem] sm:text-[0.95rem]">🇬🇧</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cn(
          "min-w-0 flex-1 border-none px-2.5 py-2.5 font-jetbrains text-base font-bold tracking-wide uppercase focus:outline-none sm:px-4 sm:py-3.5 sm:text-xl sm:tracking-widest md:text-2xl",
          isOnDark
            ? "bg-cream text-navy placeholder:text-navy/40 focus:bg-white"
            : "bg-white text-navy placeholder:text-navy/40 focus:bg-cream",
          inputClassName,
        )}
      />
    </div>
  );
}
