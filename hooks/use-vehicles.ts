"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { queryKeys } from "@/lib/query-keys";
import { apiGet, apiPost, ApiError } from "@/lib/api-client";
import type {
  VrmLookupResponse,
  MotDefectWithPricing,
  CreateRequestWithDefectsInput,
  CreateRequestWithDefectsResponse,
} from "@/types/vehicle";

export function useVrmLookup() {
  return useMutation({
    mutationFn: async (vrm: string): Promise<VrmLookupResponse> => {
      try {
        return await apiGet<VrmLookupResponse>(
          `/api/vehicles/lookup/${encodeURIComponent(vrm)}`,
        );
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          throw new Error(
            "Vehicle not found. Please check the registration number.",
          );
        }
        if (error instanceof ApiError && error.status === 429) {
          throw new Error(
            "Too many vehicle lookups. Please wait a minute and try again.",
          );
        }
        throw error;
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to look up vehicle");
    },
  });
}

export function useSubmitSelection() {
  return useMutation({
    mutationFn: async (
      input: CreateRequestWithDefectsInput,
    ): Promise<CreateRequestWithDefectsResponse> =>
      apiPost<CreateRequestWithDefectsResponse>(
        "/api/vehicles/submit-selection",
        input,
      ),
    onError: (error) => {
      toast.error(error.message || "Failed to submit selection");
    },
  });
}

export function useDefectsWithPricing(motTestId?: string) {
  return useQuery({
    queryKey: queryKeys.motTests.defectsWithPricing(motTestId || ""),
    queryFn: async (): Promise<MotDefectWithPricing[]> => {
      if (!motTestId) return [];
      return apiGet<MotDefectWithPricing[]>(
        `/api/mot-tests/${motTestId}/defects`,
      );
    },
    enabled: !!motTestId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateRequestWithDefects() {
  return useMutation({
    mutationFn: async (
      input: CreateRequestWithDefectsInput,
    ): Promise<CreateRequestWithDefectsResponse> =>
      apiPost<CreateRequestWithDefectsResponse>(
        "/api/vehicles/submit-selection",
        input,
      ),
    onError: (error) => {
      if (error instanceof ApiError && error.message === "UNAUTHORIZED") {
        toast.error("Please log in to submit a request");
        return;
      }
      toast.error(error.message || "Failed to submit request");
    },
  });
}
