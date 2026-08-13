/**
 * WebSocket Types
 * Matches backend websocket.types.ts
 */

/**
 * WebSocket message types
 */
export type WSMessageType =
  | "ping"
  | "pong"
  | "subscribe"
  | "unsubscribe"
  | "chat"
  | "message"
  | "error"
  | "connected"
  | "presence"
  | "presence_request"
  | "typing"
  | "quote_request"
  | "notification";

/**
 * WebSocket message format
 */
export interface WSMessage<T = unknown> {
  type: WSMessageType;
  topic?: string;
  payload?: T;
  timestamp: number;
}

/**
 * Chat message payload
 */
export interface ChatPayload {
  senderId: string;
  content: string;
  timestamp: number;
  /** Message type - defaults to "chat" for regular messages */
  _type?: "chat" | "quote_request";
  /** Quote request data when _type is "quote_request" */
  _quoteRequest?: QuoteRequestPayload;
}

/**
 * Connection payload
 */
export interface ConnectionPayload {
  connectionId: string;
  userId?: string;
  chatId?: string;
}

/**
 * Error payload
 */
export interface ErrorPayload {
  message: string;
  code?: string;
}

/**
 * Presence payload - user online/offline status
 */
export interface PresencePayload {
  userId: string;
  userRole: "admin" | "customer";
  isOnline: boolean;
  userName?: string;
}

/**
 * Typing indicator payload
 */
export interface TypingPayload {
  userId: string;
  userRole: "admin" | "customer";
  isTyping: boolean;
}

/**
 * Quote request payload - displayed as a UI card in chat
 */
export interface QuoteRequestPayload {
  requestId: string;
  customerId: string;
  name: string;
  vrm: string;
  postcode: string;
  notes?: string | null;
  status: "quote_requested" | "quote_sent" | "quote_accepted" | "paid" | "rejected" | "closed";
  createdAt: string;
}

/**
 * Notification types
 */
export type NotificationType =
  | "order_created"
  | "order_updated"
  | "order_status_changed"
  | "quote_received"
  | "quote_accepted"
  | "quote_rejected"
  | "payment_received"
  | "payment_failed"
  | "message_received"
  | "request_created"
  | "request_updated"
  | "general";

/**
 * Notification payload - sent for various system events
 */
export interface NotificationPayload {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

/**
 * WebSocket connection state
 */
export type WSConnectionState = "connecting" | "connected" | "disconnected" | "error";

/**
 * WebSocket hook options
 */
export interface UseWebSocketOptions {
  onMessage?: (message: WSMessage) => void;
  onConnect?: (connectionId: string) => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

/**
 * Chat hook options
 */
export interface UseChatOptions {
  onConnect?: (connectionId: string) => void;
}
