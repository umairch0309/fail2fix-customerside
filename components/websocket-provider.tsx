"use client";

import { useEffect } from "react";
import { useWebSocketStore } from "@/stores/websocket-store";
import { useWebSocketQuerySync } from "@/hooks/use-websocket-query-sync";

/**
 * WebSocket Provider
 *
 * Initializes WebSocket connection when mounted.
 * Place in dashboard layout to connect when customer enters dashboard.
 *
 * Also syncs WebSocket notifications with TanStack Query cache
 * to ensure UI stays up-to-date when real-time events arrive.
 */
export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const connect = useWebSocketStore((state) => state.connect);
  const disconnect = useWebSocketStore((state) => state.disconnect);

  // Sync WebSocket notifications with TanStack Query cache
  // This ensures data refetches when notifications like "quote_received" arrive
  useWebSocketQuerySync();

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return <>{children}</>;
}
