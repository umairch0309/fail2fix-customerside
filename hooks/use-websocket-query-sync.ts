"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocketStore } from "@/stores/websocket-store";
import { queryKeys } from "@/lib/query-keys";
import type { NotificationType, NotificationPayload } from "@/types/websocket";

/**
 * Maps notification types to the query keys that should be invalidated
 * Only invalidates active queries (currently being observed) for performance
 */
const notificationQueryMap: Record<NotificationType, () => readonly (readonly string[])[]> = {
  // Quote events
  quote_received: () => [
    queryKeys.quotes.all,
    queryKeys.requests.all, // Request status changes to quote_sent
  ],
  quote_accepted: () => [queryKeys.quotes.all, queryKeys.orders.all],
  quote_rejected: () => [queryKeys.quotes.all],

  // Order events
  order_created: () => [queryKeys.orders.all],
  order_updated: () => [queryKeys.orders.all],
  order_status_changed: () => [queryKeys.orders.all],

  // Payment events
  payment_received: () => [queryKeys.orders.all, queryKeys.payments.all],
  payment_failed: () => [queryKeys.orders.all, queryKeys.payments.all],

  // Request events
  request_created: () => [queryKeys.requests.all],
  request_updated: () => [queryKeys.requests.all],

  // Message events - chat handles this via WebSocket store
  message_received: () => [],

  // General - no specific invalidation
  general: () => [],
};

/**
 * Hook that syncs WebSocket notifications with TanStack Query cache
 *
 * When a notification arrives via WebSocket, this hook automatically
 * invalidates the relevant queries so the UI stays up-to-date.
 *
 * Features:
 * - Only invalidates active queries (performance)
 * - Tracks processed notifications to avoid duplicates
 * - Invalidates detail queries when IDs are provided
 *
 * @example
 * // Mount once in your dashboard layout
 * function DashboardLayout({ children }) {
 *   useWebSocketQuerySync();
 *   return <div>{children}</div>;
 * }
 */
export function useWebSocketQuerySync() {
  const queryClient = useQueryClient();
  const notifications = useWebSocketStore((state) => state.notifications);

  // Track the last processed notification ID to avoid duplicate processing
  const lastProcessedIdRef = useRef<string | null>(null);
  // Track all processed IDs in this session (for rapid notifications)
  const processedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // No notifications to process
    if (notifications.length === 0) return;

    // Get the latest notification
    const latestNotification = notifications[0];

    // Skip if already processed
    if (
      !latestNotification ||
      processedIdsRef.current.has(latestNotification.id)
    ) {
      return;
    }

    // Mark as processed
    processedIdsRef.current.add(latestNotification.id);
    lastProcessedIdRef.current = latestNotification.id;

    // Get query keys to invalidate for this notification type
    const getQueryKeys = notificationQueryMap[latestNotification.type];
    if (!getQueryKeys) return;

    const queryKeysToInvalidate = getQueryKeys();
    if (queryKeysToInvalidate.length === 0) return;

    // Invalidate each query key (only active queries for performance)
    queryKeysToInvalidate.forEach((queryKey) => {
      queryClient.invalidateQueries({
        queryKey,
        refetchType: "active", // Only refetch queries currently being observed
      });
    });

    // Also invalidate specific detail queries if IDs are provided in notification data
    invalidateDetailQueries(queryClient, latestNotification);

    // Cleanup old processed IDs (keep last 100)
    if (processedIdsRef.current.size > 100) {
      const idsArray = Array.from(processedIdsRef.current);
      processedIdsRef.current = new Set(idsArray.slice(-50));
    }
  }, [notifications, queryClient]);
}

/**
 * Invalidate specific detail queries when IDs are provided in notification data
 */
function invalidateDetailQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  notification: NotificationPayload
) {
  const { type, data } = notification;

  // Extract IDs from notification data
  const quoteId = data?.quoteId as string | undefined;
  const orderId = data?.orderId as string | undefined;
  const requestId = data?.requestId as string | undefined;

  // Invalidate quote detail
  if (quoteId && ["quote_received", "quote_accepted", "quote_rejected"].includes(type)) {
    queryClient.invalidateQueries({
      queryKey: queryKeys.quotes.detail(quoteId),
      refetchType: "active",
    });
  }

  // Invalidate order detail
  if (orderId && ["order_created", "order_updated", "order_status_changed", "payment_received", "payment_failed"].includes(type)) {
    queryClient.invalidateQueries({
      queryKey: queryKeys.orders.detail(orderId),
      refetchType: "active",
    });
  }

  // Invalidate request detail
  if (requestId && ["request_created", "request_updated", "quote_received"].includes(type)) {
    queryClient.invalidateQueries({
      queryKey: queryKeys.requests.detail(requestId),
      refetchType: "active",
    });
  }
}
