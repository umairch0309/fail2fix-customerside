"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";

export interface CustomerDashboardStats {
  requests: number;
  quotesReceived: number;
  activeOrders: number;
  pendingPayments: number;
}

export function useMyDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "my-stats"],
    queryFn: async (): Promise<CustomerDashboardStats> =>
      apiGet<CustomerDashboardStats>("/api/dashboard/my-stats"),
    staleTime: 30 * 1000,
  });
}
