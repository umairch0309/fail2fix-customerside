"use client";

import { Phone } from "lucide-react";
import { PHONE_DISPLAY } from "@/lib/marketing/constants";
import { PhoneLink } from "@/components/marketing/phone-link";

export function FloatingCallButton() {
  return (
    <>
      {/* Desktop FAB */}
      <PhoneLink
        source="floating_fab_desktop"
        className="fixed right-6 bottom-6 z-50 hidden items-center gap-2 rounded-full bg-amber px-5 py-3.5 font-semibold text-navy shadow-[0_8px_24px_rgba(255,140,50,0.45)] transition hover:-translate-y-0.5 hover:bg-amber-dark md:inline-flex"
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        Call Us
      </PhoneLink>

      {/* Mobile fixed call bar */}
      <div className="fixed right-0 bottom-0 left-0 z-60 bg-navy px-3 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.2)] pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
        <PhoneLink
          source="floating_bar_mobile"
          className="mx-auto flex w-full max-w-[1180px] items-center justify-center gap-2 rounded-[10px] bg-amber py-3.5 text-[0.95rem] font-bold text-navy"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          Call {PHONE_DISPLAY}
        </PhoneLink>
      </div>
    </>
  );
}
