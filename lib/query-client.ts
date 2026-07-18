import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Longer client cache reduces duplicate API traffic after navigation
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
