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
          "flex shrink-0 flex-col items-center justify-center gap-0.5 px-2 py-1 font-inter text-[0.65rem] leading-none font-bold sm:px-2.5 sm:text-[0.7rem]",
          isOnDark ? "bg-navy text-cream" : "bg-navy text-cream",
        )}
        aria-hidden
      >
        {/* Inline SVG — emoji 🇬🇧 often falls back to literal "GB" letters */}
        <svg
          viewBox="0 0 60 30"
          className="h-2.5 w-5 sm:h-3 sm:w-6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="60" height="30" fill="#012169" />
          <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="6" />
          <path
            d="M0 0 L60 30 M60 0 L0 30"
            stroke="#C8102E"
            strokeWidth="2"
          />
          <path d="M30 0 V30 M0 15 H60" stroke="#fff" strokeWidth="10" />
          <path d="M30 0 V30 M0 15 H60" stroke="#C8102E" strokeWidth="6" />
        </svg>
        <span>GB</span>
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
