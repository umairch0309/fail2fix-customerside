"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { queryKeys } from "@/lib/query-keys";
import { apiGet, apiPost, unwrapListData, type PaginatedResponse } from "@/lib/api-client";
import type { Quote, QuoteListItem, RejectQuoteInput } from "@/types/quote";

/**
 * Quote Hooks (Customer Portal)
 * Handles quote viewing and actions for customers
 * Note: Backend only returns quotes that have been sent (no drafts)
 */

/**
 * Get all quotes for the current customer
 * Only returns quotes with status != draft (backend enforced)
 */
export function useQuotes() {
  return useQuery({
    queryKey: queryKeys.quotes.all,
    queryFn: async (): Promise<QuoteListItem[]> => {
      const data = await apiGet<QuoteListItem[] | PaginatedResponse<QuoteListItem>>(
        "/api/quotes",
      );
      return unwrapListData(data);
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Get a single quote by ID
 * Backend validates customer owns this quote
 */
export function useQuote(quoteId?: string) {
  return useQuery({
    queryKey: queryKeys.quotes.detail(quoteId || ""),
    queryFn: async (): Promise<Quote | null> => {
      if (!quoteId) return null;

      return apiGet<Quote | null>(`/api/quotes/${quoteId}`);
    },
    enabled: !!quoteId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Accept Quote Response
 * Returns checkout URL for Stripe redirect
 */
interface AcceptQuoteResponse {
  checkoutUrl: string;
  sessionId: string;
  quoteId: string;
}

/**
 * Accept a quote - redirects to Stripe checkout
 */
export function useAcceptQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteId: string): Promise<AcceptQuoteResponse> => {
      return apiPost<AcceptQuoteResponse>(`/api/quotes/${quoteId}/accept`);
    },
    onSuccess: (data, quoteId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.quotes.detail(quoteId),
      });

      toast.success("Quote accepted!");
    },
    onError: (error) => {
      if (error.message === "UNAUTHORIZED") {
        toast.error("Please log in to accept this quote");
        return;
      }
      toast.error(error.message || "Failed to accept quote");
    },
  });
}

/**
 * Reject a quote
 */
export function useRejectQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quoteId,
      input,
    }: {
      quoteId: string;
      input: RejectQuoteInput;
    }): Promise<Quote> => {
      return apiPost<Quote>(`/api/quotes/${quoteId}/reject`, input);
    },
    onSuccess: (_, { quoteId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.quotes.detail(quoteId),
      });
      toast.success("Quote rejected");
    },
    onError: (error) => {
      if (error.message === "UNAUTHORIZED") {
        toast.error("Please log in to reject this quote");
        return;
      }
      toast.error(error.message || "Failed to reject quote");
    },
  });
}
