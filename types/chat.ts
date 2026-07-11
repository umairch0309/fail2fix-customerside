/**
 * Chat Types
 * Matches backend chat schema
 */

/**
 * Message type
 */
export type MessageType = "chat" | "quote_request";

/**
 * Quote request metadata stored in message
 */
export interface QuoteRequestMetadata {
  requestId: string;
  customerId: string;
  name: string;
  vrm: string;
  postcode: string;
  notes?: string | null;
  status: "quote_requested" | "quote_sent" | "accepted" | "rejected" | "closed";
  createdAt: string;
}

/**
 * Chat message from API
 */
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  metadata: QuoteRequestMetadata | null;
  readAt: Date | null;
  createdAt: Date;
  senderName: string | null;
  senderRole: string | null;
}

/**
 * Chat from API
 */
export interface Chat {
  id: string;
  customerId: string;
  lastMessageAt: Date | null;
  createdAt: Date;
}

/**
 * Chat with customer info (for admin)
 */
export interface ChatWithCustomer extends Chat {
  customerName: string | null;
  customerEmail: string | null;
}
