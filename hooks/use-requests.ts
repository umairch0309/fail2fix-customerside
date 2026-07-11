"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { queryKeys } from "@/lib/query-keys";
import { apiFetch, apiGet, apiPost, unwrapListData, type PaginatedResponse } from "@/lib/api-client";
import type { Request, CreateRequestInput } from "@/types/request";

/**
 * Request Hooks
 * Handles MOT repair request management
 */

/**
 * Get all requests for the current user
 */
export function useRequests() {
  return useQuery({
    queryKey: queryKeys.requests.all,
    queryFn: async (): Promise<Request[]> => {
      const data = await apiGet<Request[] | PaginatedResponse<Request>>(
        "/api/requests",
      );
      return unwrapListData(data);
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Get a single request by ID
 */
export function useRequest(requestId?: string) {
  return useQuery({
    queryKey: queryKeys.requests.detail(requestId || ""),
    queryFn: async (): Promise<Request | null> => {
      if (!requestId) return null;

      return apiGet<Request | null>(`/api/requests/${requestId}`);
    },
    enabled: !!requestId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Create a new request with optimistic updates
 */
export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateRequestInput): Promise<Request> => {
      return apiPost<Request>("/api/requests", input);
    },
    onMutate: async (newRequest) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.requests.all });

      const previousRequests = queryClient.getQueryData<Request[]>(
        queryKeys.requests.all
      );

      const optimisticRequest: Request = {
        id: `temp-${Date.now()}`,
        customerId: "",
        name: newRequest.name,
        email: newRequest.email,
        phone: newRequest.phone,
        vrm: newRequest.vrm,
        postcode: newRequest.postcode,
        motDetailsUrl: newRequest.motDetailsUrl || null,
        notes: newRequest.notes || null,
        status: "quote_requested",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Request[]>(queryKeys.requests.all, (old) => {
        return old ? [optimisticRequest, ...old] : [optimisticRequest];
      });

      return { previousRequests, optimisticRequest };
    },
    onError: (error, _newRequest, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(
          queryKeys.requests.all,
          context.previousRequests
        );
      }

      if (error.message === "UNAUTHORIZED") {
        toast.error("Please log in to submit a request");
        return;
      }

      toast.error(error.message || "Failed to submit request");
    },
    onSuccess: (data, _variables, context) => {
      queryClient.setQueryData<Request[]>(queryKeys.requests.all, (old) => {
        if (!old) return [data];
        return old.map((request) =>
          request.id === context?.optimisticRequest.id ? data : request
        );
      });

      toast.success("Request submitted successfully!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
    },
  });
}

/**
 * Upload MOT details file and get URL
 */
export function useUploadMotDetails() {
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("file", file);

      const result = await apiFetch<{ url: string }>("/api/upload/mot-documents", {
        method: "POST",
        body: formData,
      });
      return result.url;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload file");
    },
  });
}
