"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { apiGet, ApiError } from "@/lib/api-client";
import type { Order, OrderListItem } from "@/types/order";

export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: async (): Promise<OrderListItem[]> =>
      apiGet<OrderListItem[]>("/api/orders"),
    staleTime: 2 * 60 * 1000,
  });
}

export function useOrder(orderId?: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId || ""),
    queryFn: async (): Promise<Order | null> => {
      if (!orderId) return null;

      try {
        return await apiGet<Order>(`/api/orders/${orderId}`);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000,
  });
}
