"use client";

import { useQuoteEntry } from "@/components/marketing/quote-entry-context";
import { PlateInput } from "@/components/marketing/plate-input";

export function StickyCta() {
  const { vrm, setVrm, openQuoteModal } = useQuoteEntry();

  return (
    <div className="fixed right-0 bottom-0 left-0 z-60 bg-navy px-3 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.2)] pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="mx-auto flex w-full max-w-[1180px] min-w-0 items-center gap-2">
        <PlateInput
          value={vrm}
          onChange={setVrm}
          tone="onDark"
          className="min-w-0 flex-1 rounded-[7px] border-2"
          inputClassName="px-2 py-2 text-[0.85rem] sm:text-[0.9rem] sm:tracking-wide"
        />
        <button
          type="button"
          onClick={openQuoteModal}
          className="shrink-0 cursor-pointer rounded-[7px] bg-amber px-3 py-2.5 text-[0.8rem] font-bold whitespace-nowrap text-navy sm:px-4 sm:text-[0.82rem]"
        >
          Get quote →
        </button>
      </div>
    </div>
  );
}
