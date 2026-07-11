"use client";

import { Phone } from "lucide-react";
import { useQuoteEntry } from "@/components/marketing/quote-entry-context";
import { PlateInput } from "@/components/marketing/plate-input";
import { PhoneLink } from "@/components/marketing/phone-link";
import { PHONE_DISPLAY } from "@/lib/marketing/constants";

export function LocationQuoteCta() {
  const { vrm, setVrm, openQuoteModal } = useQuoteEntry();

  return (
    <div className="mx-auto flex w-full max-w-[360px] flex-col items-stretch gap-3">
      <PlateInput value={vrm} onChange={setVrm} tone="onDark" />
      <button
        type="button"
        onClick={openQuoteModal}
        className="w-full cursor-pointer rounded-lg bg-amber py-3.5 text-[0.95rem] font-bold text-navy transition hover:bg-amber-dark sm:text-base"
      >
        Get my repair quote →
      </button>
      <PhoneLink
        source="location_hero"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-cream/25 bg-cream/10 px-6 py-3.5 font-bold text-cream transition hover:bg-cream/15"
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        Call {PHONE_DISPLAY}
      </PhoneLink>
    </div>
  );
}

export function LocationFinalCta() {
  const { openQuoteModal } = useQuoteEntry();

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
      <PhoneLink
        source="location_final_cta"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber px-6 py-3.5 font-bold text-navy transition hover:bg-amber-dark sm:w-auto"
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        Call {PHONE_DISPLAY}
      </PhoneLink>
      <button
        type="button"
        onClick={openQuoteModal}
        className="w-full cursor-pointer rounded-lg border border-cream/25 bg-cream/10 px-6 py-3.5 font-bold text-cream transition hover:bg-cream/15 sm:w-auto"
      >
        Check My MOT
      </button>
    </div>
  );
}
