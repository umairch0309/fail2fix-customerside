/**
 * React Query Keys
 *
 * Centralized location for all query keys used in the application
 */

export const queryKeys = {
  // Auth related keys
  auth: {
    session: ["session"] as const,
    user: ["user"] as const,
  },

  // Request related keys
  requests: {
    all: ["requests"] as const,
    list: (filters?: Record<string, unknown>) => ["requests", "list", filters] as const,
    detail: (id: string) => ["requests", id] as const,
  },

  // Quote related keys
  quotes: {
    all: ["quotes"] as const,
    list: (filters?: Record<string, unknown>) => ["quotes", "list", filters] as const,
    detail: (id: string) => ["quotes", id] as const,
    byRequest: (requestId: string) => ["quotes", "request", requestId] as const,
  },

  // Order related keys
  orders: {
    all: ["orders"] as const,
    list: (filters?: Record<string, unknown>) => ["orders", "list", filters] as const,
    detail: (id: string) => ["orders", id] as const,
  },

  // Payment related keys
  payments: {
    all: ["payments"] as const,
    list: (filters?: Record<string, unknown>) => ["payments", "list", filters] as const,
    detail: (id: string) => ["payments", id] as const,
  },

  // Chat related keys
  chats: {
    all: ["chats"] as const,
    list: ["chats", "list"] as const,
    myMessages: ["chats", "my", "messages"] as const,
    detail: (id: string) => ["chats", id] as const,
    messages: (chatId: string) => ["chats", chatId, "messages"] as const,
  },

  // Notification related keys
  notifications: {
    all: ["notifications"] as const,
    unreadCount: ["notifications", "unread-count"] as const,
  },

  // Vehicle related keys
  vehicles: {
    all: ["vehicles"] as const,
    byVrm: (vrm: string) => ["vehicles", "vrm", vrm] as const,
    detail: (id: string) => ["vehicles", id] as const,
    motTests: (vehicleId: string) => ["vehicles", vehicleId, "mot-tests"] as const,
  },

  // MOT Test related keys
  motTests: {
    all: ["mot-tests"] as const,
    detail: (id: string) => ["mot-tests", id] as const,
    defects: (motTestId: string) => ["mot-tests", motTestId, "defects"] as const,
    defectsWithPricing: (motTestId: string) => ["mot-tests", motTestId, "defects-pricing"] as const,
  },

  // Blog related keys (from Payload CMS)
  blogs: {
    all: ["blogs"] as const,
    list: (filters?: { page?: number; limit?: number }) => ["blogs", "list", filters] as const,
    detail: (slug: string) => ["blogs", slug] as const,
    byId: (id: number | string) => ["blogs", "id", id] as const,
  },
} as const;
