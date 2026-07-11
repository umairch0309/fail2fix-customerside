/**
 * Order Types (Customer Portal)
 * Matches backend schema
 */

/**
 * Order Status - matches backend enum
 */
export type OrderStatus =
  | "pending"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "cancelled"
  | "closed";

/**
 * Quote item for order display
 */
export interface OrderQuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  total: string;
  sortOrder: number;
}

/**
 * Order update type
 */
export type OrderUpdateType = "info" | "warning" | "critical";

/**
 * Order update from admin
 */
export interface OrderUpdate {
  id: string;
  orderId: string;
  type: OrderUpdateType;
  content: string;
  createdBy: string | null;
  createdAt: string;
  createdByName: string | null;
}

/**
 * Order from API
 */
export interface Order {
  id: string;
  orderNumber: string;
  quoteId: string;
  customerId: string;
  status: OrderStatus;
  scheduledDate: string | null;
  assignedTo: string | null;
  completedAt: string | null;
  completionOtpVerified: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  // Full quote with items
  quote?: {
    id: string;
    requestId: string | null;
    invoiceNumber: string | null;
    title: string | null;
    subtotal: string;
    vatRate: string;
    vatAmount: string;
    total: string;
    notes: string | null;
    createdAt: string;
    sentAt: string | null;
    acceptedAt: string | null;
    items: OrderQuoteItem[];
  };
  // Payment info
  payment?: {
    id: string;
    status: string;
    method: string;
    amount: string;
    paidAt: string | null;
  };
  // Order updates
  updates?: OrderUpdate[];
}

/**
 * Order list item (simplified)
 */
export interface OrderListItem {
  id: string;
  orderNumber: string;
  quoteId: string;
  customerId: string;
  status: OrderStatus;
  scheduledDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  // Quote info
  quoteTitle: string | null;
  quoteTotal: string;
}

/**
 * Status display configuration
 */
export const orderStatusConfig: Record<
  OrderStatus,
  {
    label: string;
    textColor: string;
    borderColor: string;
    bgColor: string;
  }
> = {
  pending: {
    label: "Pending",
    textColor: "#1E40AF",
    borderColor: "#BFDBFE",
    bgColor: "#EFF6FF",
  },
  in_progress: {
    label: "In Progress",
    textColor: "#7C3AED",
    borderColor: "#DDD6FE",
    bgColor: "#F5F3FF",
  },
  on_hold: {
    label: "On Hold",
    textColor: "#813500",
    borderColor: "#FFE4D2",
    bgColor: "#FFF8F3",
  },
  completed: {
    label: "Completed",
    textColor: "#395214",
    borderColor: "#B3EC3D",
    bgColor: "#FBFFF4",
  },
  cancelled: {
    label: "Cancelled",
    textColor: "#FF1603",
    borderColor: "#FFE1E1",
    bgColor: "#FFF8F8",
  },
  closed: {
    label: "Closed",
    textColor: "#6B7280",
    borderColor: "#D1D5DB",
    bgColor: "#F9FAFB",
  },
};
