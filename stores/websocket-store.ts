import { create } from "zustand";
import { toast } from "@/components/ui/sonner";
import { buildAuthenticatedWsUrl, fetchWsTicket } from "@/lib/ws-ticket";
import { playNotificationSound } from "@/lib/notification-sound";
import type { WSMessage, ChatPayload, ConnectionPayload, PresencePayload, TypingPayload, QuoteRequestPayload, NotificationPayload } from "@/types/websocket";

type WSConnectionState = "connecting" | "connected" | "disconnected" | "error";

export type WebSocketState = {
  // Connection state
  socket: WebSocket | null;
  state: WSConnectionState;
  connectionId: string | null;
  userId: string | null;
  chatId: string | null;

  // Messages
  messages: ChatPayload[];
  unreadCount: number;

  // Notifications
  notifications: NotificationPayload[];
  unreadNotificationCount: number;

  // Presence - is the other party online?
  isOtherPartyOnline: boolean;
  otherPartyRole: "admin" | "customer" | null;
  onlineUsers: Record<string, "admin" | "customer">;

  // Typing indicator
  isOtherPartyTyping: boolean;
};

export type WebSocketActions = {
  // Connection
  connect: () => void;
  disconnect: () => void;

  // Messages
  sendMessage: (content: string) => boolean;
  clearMessages: () => void;
  markAsRead: () => void;

  // Typing
  sendTyping: (isTyping: boolean) => void;

  // Notifications
  addNotification: (notification: NotificationPayload) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
};

export type WebSocketStore = WebSocketState & WebSocketActions;

let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempts = 0;
let allowReconnect = true;
let connectInFlight = false;
const MAX_RECONNECT_ATTEMPTS = 5;
const BASE_RECONNECT_MS = 3000;

let typingTimeout: ReturnType<typeof setTimeout> | null = null;

function clearReconnectTimer() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function scheduleReconnect(connect: () => void) {
  if (!allowReconnect) return;
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.warn(
      "[WS] Giving up reconnect after",
      MAX_RECONNECT_ATTEMPTS,
      "attempts (serverless hosts often lack WebSocket support)",
    );
    return;
  }

  if (reconnectTimer) return;

  const delay = BASE_RECONNECT_MS * Math.pow(2, reconnectAttempts);
  reconnectAttempts += 1;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, delay);
}


export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  // Initial state
  socket: null,
  state: "disconnected",
  connectionId: null,
  userId: null,
  chatId: null,
  messages: [],
  unreadCount: 0,
  notifications: [],
  unreadNotificationCount: 0,
  isOtherPartyOnline: false,
  otherPartyRole: null,
  isOtherPartyTyping: false,
  onlineUsers: {},

  // Connect to WebSocket
  connect: () => {
    void (async () => {
    const { socket } = get();

    // Don't connect on server or if already connected
    if (typeof window === "undefined") return;
    if (socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING) return;
    if (connectInFlight) return;

    connectInFlight = true;
    allowReconnect = true;
    clearReconnectTimer();
    set({ state: "connecting" });

    let ticket: string | null;
    try {
      ticket = await fetchWsTicket();
    } catch (error) {
      console.warn("[WS] Ticket request failed:", error);
      connectInFlight = false;
      set({ state: "error" });
      scheduleReconnect(() => get().connect());
      return;
    }

    if (!ticket) {
      connectInFlight = false;
      set({ state: "disconnected" });
      console.warn("[WS] No session — skip connect");
      return;
    }

    if (!allowReconnect) {
      connectInFlight = false;
      return;
    }

    // Close existing
    if (socket) {
      socket.close();
    }

    const ws = new WebSocket(buildAuthenticatedWsUrl(ticket));
    connectInFlight = false;

    ws.onopen = () => {
      reconnectAttempts = 0;
      set({ state: "connected", socket: ws });
      clearReconnectTimer();
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WSMessage;

        // Handle connected message
        if (message.type === "connected") {
          const payload = message.payload as ConnectionPayload;
          set({
            connectionId: payload.connectionId,
            userId: payload.userId ?? null,
            chatId: payload.chatId ?? null,
          });
          const liveChatId = payload.chatId ?? get().chatId;
          if (liveChatId && ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "presence_request",
                topic: `chat:${liveChatId}`,
                timestamp: Date.now(),
              }),
            );
          }
        }

        // Handle presence updates
        if (message.type === "presence" && message.topic?.startsWith("chat:")) {
          const presencePayload = message.payload as PresencePayload;
          const { userId, onlineUsers } = get();
          if (presencePayload.userId === userId) return;

          const next = { ...onlineUsers };
          if (presencePayload.isOnline) {
            next[presencePayload.userId] = presencePayload.userRole;
          } else {
            delete next[presencePayload.userId];
          }
          const adminOnline = Object.values(next).includes("admin");
          set({
            onlineUsers: next,
            isOtherPartyOnline: adminOnline,
            otherPartyRole: adminOnline ? "admin" : null,
          });
        }

        // Handle typing indicators
        if (message.type === "typing" && message.topic?.startsWith("chat:")) {
          const typingPayload = message.payload as TypingPayload;
          const { userId } = get();

          // Only care about other party's typing
          if (typingPayload.userId !== userId) {
            set({ isOtherPartyTyping: typingPayload.isTyping });

            // Auto-clear typing indicator after 3 seconds (in case stop wasn't received)
            if (typingPayload.isTyping) {
              if (typingTimeout) clearTimeout(typingTimeout);
              typingTimeout = setTimeout(() => {
                set({ isOtherPartyTyping: false });
              }, 3000);
            }
          }
        }

        // Handle chat messages
        if (message.type === "chat" && message.topic?.startsWith("chat:")) {
          const chatPayload = message.payload as ChatPayload;
          const { userId, messages, onlineUsers } = get();

          if (chatPayload.senderId && chatPayload.senderId !== userId) {
            const next = {
              ...onlineUsers,
              [chatPayload.senderId]: "admin" as const,
            };
            set({
              onlineUsers: next,
              isOtherPartyOnline: true,
              otherPartyRole: "admin",
            });
          }

          // Add message to store
          set({ messages: [...messages, chatPayload] });

          // Clear typing indicator when message received
          set({ isOtherPartyTyping: false });

          // Show toast for messages from others (not on chat page)
          if (chatPayload.senderId !== userId) {
            // Check if we're not on the chat page
            if (!window.location.pathname.includes("/chats")) {
              set((state) => ({ unreadCount: state.unreadCount + 1 }));
              toast.info("New message from Fail2Fix Support", {
                description: chatPayload.content.slice(0, 50) + (chatPayload.content.length > 50 ? "..." : ""),
                action: {
                  label: "View",
                  onClick: () => {
                    window.location.href = "/chats";
                  },
                },
              });
            }
          }
        }

        // Handle quote request messages - display as UI card in chat
        if (message.type === "quote_request" && message.topic?.startsWith("chat:")) {
          const quotePayload = message.payload as QuoteRequestPayload;
          const { messages } = get();

          // Create a chat message with quote request data (from customer)
          const quoteMessage: ChatPayload = {
            senderId: quotePayload.customerId,
            content: `Quote requested for ${quotePayload.vrm}`,
            timestamp: new Date(quotePayload.createdAt).getTime(),
            _type: "quote_request",
            _quoteRequest: quotePayload,
          };

          // Add to messages
          set({ messages: [...messages, quoteMessage] });
        }

        // Handle notification messages
        if (message.type === "notification") {
          const notification = message.payload as NotificationPayload;
          const { notifications } = get();

          // Add to notifications (newest first)
          set({
            notifications: [notification, ...notifications],
            unreadNotificationCount: get().unreadNotificationCount + 1,
          });

          // Play notification sound
          playNotificationSound("request");

          // Show toast notification
          toast.message(notification.title, {
            description: notification.message,
            action: notification.data?.orderId ? {
              label: "View",
              onClick: () => {
                window.location.href = `/orders/${notification.data?.orderId}`;
              },
            } : notification.data?.quoteId ? {
              label: "View",
              onClick: () => {
                window.location.href = `/quotes/${notification.data?.quoteId}`;
              },
            } : undefined,
          });
        }
      } catch (error) {
        console.error("[WS] Parse error:", error);
      }
    };

    ws.onclose = () => {
      set({ state: "disconnected", socket: null, connectionId: null });
      if (allowReconnect) {
        scheduleReconnect(() => get().connect());
      }
    };

    ws.onerror = () => {
      set({ state: "error" });
    };

    set({ socket: ws });
    })();
  },

  // Disconnect
  disconnect: () => {
    const { socket } = get();
    allowReconnect = false;
    clearReconnectTimer();
    reconnectAttempts = 0;
    if (socket) {
      socket.close();
    }
    set({
      socket: null,
      state: "disconnected",
      connectionId: null,
    });
  },

  // Send message
  sendMessage: (content: string) => {
    const { socket, chatId } = get();

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("[WS] Not connected");
      return false;
    }

    if (!chatId) {
      console.warn("[WS] No chatId");
      return false;
    }

    socket.send(
      JSON.stringify({
        type: "chat",
        topic: `chat:${chatId}`,
        payload: content,
        timestamp: Date.now(),
      })
    );
    return true;
  },

  // Clear messages
  clearMessages: () => set({ messages: [] }),

  // Mark as read
  markAsRead: () => set({ unreadCount: 0 }),

  // Send typing indicator
  sendTyping: (isTyping: boolean) => {
    const { socket, chatId } = get();

    if (!socket || socket.readyState !== WebSocket.OPEN || !chatId) {
      return;
    }

    socket.send(
      JSON.stringify({
        type: "typing",
        topic: `chat:${chatId}`,
        payload: { isTyping },
        timestamp: Date.now(),
      })
    );
  },

  // Add notification
  addNotification: (notification: NotificationPayload) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadNotificationCount: state.unreadNotificationCount + 1,
    }));
  },

  // Mark notification as read
  markNotificationAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadNotificationCount: Math.max(0, state.unreadNotificationCount - 1),
    }));
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadNotificationCount: 0,
    }));
  },

  // Clear notifications
  clearNotifications: () => set({ notifications: [], unreadNotificationCount: 0 }),
}));
