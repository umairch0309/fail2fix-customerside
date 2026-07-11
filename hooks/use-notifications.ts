"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { apiGet, apiPost } from "@/lib/api-client";
import { useWebSocketStore } from "@/stores/websocket-store";
import type { NotificationPayload } from "@/types/websocket";

export function useNotifications(limit = 50, offset = 0) {
  return useQuery({
    queryKey: [...queryKeys.notifications.all, limit, offset],
    queryFn: async (): Promise<NotificationPayload[]> =>
      apiGet<NotificationPayload[]>("/api/notifications", { limit, offset }),
    staleTime: 30 * 1000,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: async (): Promise<number> => {
      try {
        const data = await apiGet<{ count: number }>(
          "/api/notifications/unread-count",
        );
        return data?.count || 0;
      } catch {
        return 0;
      }
    },
    staleTime: 30 * 1000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const markNotificationAsRead = useWebSocketStore(
    (state) => state.markNotificationAsRead,
  );

  return useMutation({
    mutationFn: async (notificationId: string): Promise<void> =>
      apiPost(`/api/notifications/${notificationId}/read`),
    onSuccess: (_, notificationId) => {
      markNotificationAsRead(notificationId);
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unreadCount,
      });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const markAllNotificationsAsRead = useWebSocketStore(
    (state) => state.markAllNotificationsAsRead,
  );

  return useMutation({
    mutationFn: async (): Promise<void> =>
      apiPost("/api/notifications/read-all"),
    onSuccess: () => {
      markAllNotificationsAsRead();
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unreadCount,
      });
    },
  });
}
