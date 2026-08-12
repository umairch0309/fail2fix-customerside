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

    const shouldResume =
      searchParams.get(RESUME_QUOTE_PARAM) === "1" || getPendingQuote() !== null;
    if (!shouldResume) return;

    const pending = getPendingQuote();
    if (!pending) {
      if (searchParams.get(RESUME_QUOTE_PARAM) === "1") {
        router.replace("/dashboard");
      }
      return;
    }

    ranRef.current = true;

    const submit = async () => {
      try {
        toast.info("Submitting your repair quote request...");

        const lookup = await apiGet<VrmLookupResponse>(
          `/api/vehicles/lookup/${encodeURIComponent(pending.vrm)}`,
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
          // Last resort: keep the count of originally selected items
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

        const result = await apiPost<CreateRequestWithDefectsResponse>(
          "/api/vehicles/submit-selection",
          payload,
        );

        clearPendingQuote();
        markClientEnquirySubmitted(payload.email, payload.vrm);
        trackConversion();
        await queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });

        toast.success(
          result.message ||
            "We've received your quote request and will get back to you shortly.",
        );
        router.replace("/requests");
      } catch (error) {
        ranRef.current = false;
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
