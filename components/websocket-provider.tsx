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

  useWebSocketQuerySync();

  useEffect(() => {
    // Vercel serverless cannot keep WebSockets open — skip connect there
    // to avoid reconnect storms that trip the API rate limiter (429).
    const apiHost = (() => {
      try {
        return new URL(
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3007",
        ).hostname;
      } catch {
        return "";
      }
    })();
    if (apiHost.endsWith(".vercel.app")) {
      return;
    }

    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return <>{children}</>;
}
