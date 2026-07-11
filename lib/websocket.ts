import { WS_URL } from "./constants";
import type { WSMessage, WSMessageType } from "@/types/websocket";

/**
 * WebSocket Client
 *
 * Singleton client for WebSocket connections.
 * Handles connection, reconnection, and message formatting.
 */

let socket: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Create a WebSocket message
 */
export const createMessage = <T>(
  type: WSMessageType,
  payload?: T,
  topic?: string
): WSMessage<T> => ({
  type,
  topic,
  payload,
  timestamp: Date.now(),
});

/**
 * Connect to WebSocket server
 */
export const connect = (
  onMessage?: (message: WSMessage) => void,
  onOpen?: (connectionId: string) => void,
  onClose?: () => void,
  onError?: (error: Event) => void
): WebSocket => {
  // Close existing connection
  if (socket?.readyState === WebSocket.OPEN) {
    socket.close();
  }

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log("[WS] Connected");
    // Clear reconnect timer
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data) as WSMessage;

      // Handle connection confirmation
      if (message.type === "connected" && onOpen) {
        const payload = message.payload as { connectionId: string };
        onOpen(payload.connectionId);
      }

      // Forward to handler
      if (onMessage) {
        onMessage(message);
      }
    } catch (error) {
      console.error("[WS] Parse error:", error);
    }
  };

  socket.onclose = () => {
    console.log("[WS] Disconnected");
    if (onClose) onClose();
  };

  socket.onerror = (error) => {
    console.error("[WS] Error:", error);
    if (onError) onError(error);
  };

  return socket;
};

/**
 * Disconnect from WebSocket server
 */
export const disconnect = (): void => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (socket) {
    socket.close();
    socket = null;
  }
};

/**
 * Send a message
 */
export const send = <T>(type: WSMessageType, payload?: T, topic?: string): boolean => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn("[WS] Not connected");
    return false;
  }

  const message = createMessage(type, payload, topic);
  socket.send(JSON.stringify(message));
  return true;
};

/**
 * Subscribe to a topic
 */
export const subscribe = (topic: string): boolean => {
  return send("subscribe", undefined, topic);
};

/**
 * Unsubscribe from a topic
 */
export const unsubscribe = (topic: string): boolean => {
  return send("unsubscribe", undefined, topic);
};

/**
 * Send a chat message
 */
export const sendChat = (topic: string, content: string): boolean => {
  return send("chat", content, topic);
};

/**
 * Send ping (keep-alive)
 */
export const ping = (): boolean => {
  return send("ping");
};

/**
 * Get connection state
 */
export const getState = (): number => {
  return socket?.readyState ?? WebSocket.CLOSED;
};

/**
 * Check if connected
 */
export const isConnected = (): boolean => {
  return socket?.readyState === WebSocket.OPEN;
};
