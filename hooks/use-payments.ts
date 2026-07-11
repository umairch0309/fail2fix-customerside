"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { queryKeys } from "@/lib/query-keys";
import { apiGet, apiPost, ApiError } from "@/lib/api-client";
import type {
  Payment,
  DepositCheckoutResponse,
  BalanceCheckoutResponse,
  QuotePaymentStatus,
  VerifyCheckoutResponse,
} from "@/types/payment";

export function usePayments() {
  return useQuery({
    queryKey: queryKeys.payments.all,
    queryFn: async (): Promise<Payment[]> =>
      apiGet<Payment[]>("/api/payments"),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePayment(paymentId?: string) {
  return useQuery({
    queryKey: queryKeys.payments.detail(paymentId || ""),
    queryFn: async (): Promise<Payment | null> => {
      if (!paymentId) return null;

      try {
        return await apiGet<Payment>(`/api/payments/${paymentId}`);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!paymentId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useQuotePaymentStatus(quoteId?: string) {
  return useQuery({
    queryKey: ["quote", quoteId, "payment-status"],
    queryFn: async (): Promise<QuotePaymentStatus | null> => {
      if (!quoteId) return null;
      return apiGet<QuotePaymentStatus>(
        `/api/payments/quote/${quoteId}/status`,
      );
    },
    enabled: !!quoteId,
    staleTime: 30 * 1000,
  });
}

export function useCreateDepositCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteId: string): Promise<DepositCheckoutResponse> =>
      apiPost<DepositCheckoutResponse>("/api/payments/checkout/deposit", {
        quoteId,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.all });

      if (data.checkoutUrl) {
        toast.success("Redirecting to secure payment...");
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      if (error instanceof ApiError && error.message === "UNAUTHORIZED") {
        toast.error("Please log in to proceed with payment");
        return;
      }
      toast.error(error.message || "Failed to create checkout");
    },
  });
}

export function useCreateBalanceCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteId: string): Promise<BalanceCheckoutResponse> =>
      apiPost<BalanceCheckoutResponse>("/api/payments/checkout/balance", {
        quoteId,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });

      if (data.checkoutUrl) {
        toast.success("Redirecting to payment...");
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      if (error instanceof ApiError && error.message === "UNAUTHORIZED") {
        toast.error("Please log in to proceed with payment");
        return;
      }
      toast.error(error.message || "Failed to create checkout");
    },
  });
}

export function useVerifyCheckout(sessionId?: string) {
  return useQuery({
    queryKey: ["checkout", "verify", sessionId],
    queryFn: async (): Promise<VerifyCheckoutResponse | null> => {
      if (!sessionId) return null;
      return apiGet<VerifyCheckoutResponse>(
        `/api/payments/verify/${sessionId}`,
      );
    },
    enabled: !!sessionId,
    staleTime: 0,
    refetchOnMount: true,
  });
}
