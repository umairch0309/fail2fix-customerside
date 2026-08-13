"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { useSession } from "@/lib/auth-client";
import { queryKeys } from "@/lib/query-keys";
import {
  clearPendingQuote,
  getPendingQuote,
  RESUME_QUOTE_PARAM,
} from "@/lib/pending-quote";
import { markClientEnquirySubmitted } from "@/lib/enquiry-submit-guard";
import { apiGet, apiPost } from "@/lib/api-client";
import type {
  CreateRequestWithDefectsInput,
  CreateRequestWithDefectsResponse,
  VrmLookupResponse,
} from "@/types/vehicle";

function trackConversion() {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: "AW-17942814872/R3-OCKH_h_kbEJjB5utC",
      value: 1.0,
      currency: "GBP",
    });
  }
}

/**
 * After Sign In / Sign Up, submit the marketing quote draft saved in sessionStorage.
 * Runs at most once per page load — failures must not remount /dashboard in a loop.
 */
export function PendingQuoteResume() {
  const { data: session, isPending: sessionPending } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const ranRef = useRef(false);

  useEffect(() => {
    if (sessionPending || ranRef.current) return;
    if (!session?.user) return;

    const resumeFlag = searchParams.get(RESUME_QUOTE_PARAM) === "1";
    const pending = getPendingQuote();

    if (!pending) {
      // Clear stale ?resume=1 without re-triggering this effect in a loop
      if (resumeFlag) {
        ranRef.current = true;
        router.replace("/dashboard");
      }
      return;
    }

    // Lock before async work so remounts / Strict Mode cannot double-submit
    ranRef.current = true;

    const submit = async () => {
      try {
        toast.info("Submitting your repair quote request...");

        const cleanVrm = pending.vrm.toUpperCase().replace(/\s+/g, "");
        const lookup = await apiGet<VrmLookupResponse>(
          `/api/vehicles/lookup/${encodeURIComponent(cleanVrm)}`,
        );

        const textSet = new Set(
          pending.selectedDefectTexts.map((t) => t.trim().toLowerCase()),
        );
        let selectedDefectIds = lookup.defects
          .filter((d) => textSet.has(d.text.trim().toLowerCase()))
          .map((d) => d.id);

        if (selectedDefectIds.length === 0) {
          selectedDefectIds = lookup.defects
            .filter((d) => pending.selectedDefectIds.includes(d.id))
            .map((d) => d.id);
        }

        if (selectedDefectIds.length === 0 && lookup.defects.length > 0) {
          selectedDefectIds = lookup.defects
            .slice(0, Math.max(1, pending.selectedDefectTexts.length || 1))
            .map((d) => d.id);
        }

        if (selectedDefectIds.length === 0) {
          clearPendingQuote();
          toast.error(
            "Could not match MOT defects after sign in. Please create a new request from your dashboard.",
          );
          router.replace("/dashboard");
          return;
        }

        const payload: CreateRequestWithDefectsInput = {
          name: session.user.name || pending.name,
          email: session.user.email || pending.email,
          phone: pending.phone,
          vrm: pending.vrm,
          postcode: pending.postcode,
          selectedDefectIds,
          notes: pending.notes,
        };

        await apiPost<CreateRequestWithDefectsResponse>(
          "/api/vehicles/submit-selection",
          payload,
        );

        clearPendingQuote();
        markClientEnquirySubmitted(payload.email, payload.vrm);
        trackConversion();
        await queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });

        toast.success(
          "Quote request submitted. You can view it from your dashboard.",
        );
        router.replace("/requests");
      } catch (error) {
        // Keep ranRef true — do not retry forever (was blanking /dashboard)
        clearPendingQuote();
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to submit your quote request. Please try again from New Request.",
        );
        router.replace("/dashboard");
      }
    };

    void submit();
  }, [session, sessionPending, searchParams, router, queryClient]);

  return null;
}
