/**
 * Quote Types (Customer Portal)
 * Matches backend schema - customers only see sent quotes (no drafts)
 */

/**
 * Quote Status - matches backend enum
 * Note: Customers never see "draft" status
 */
export type QuoteStatus =
  | "sent"          // Awaiting deposit payment
  | "deposit_paid"  // 10% deposit paid, work in progress
  | "paid"          // Fully paid (deposit + balance)
  | "rejected"      // Customer rejected
  | "expired";      // Validity period ended

/**
 * Payment info (for quote detail)
 */
export interface QuotePayment {
  id: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paidAt: string | null;
}

/**
 * Quote Item
 */
export interface QuoteItem {
  id: string;
  quoteId: string;
  description: string;
  quantity: number;
  unitPrice: string;
  total: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Quote with items (full detail)
 */
export interface Quote {
  id: string;
  requestId: string | null;
  customerId: string;
  invoiceNumber: string | null;
  title: string | null;
  subtotal: string;
  vatRate: string;
  vatAmount: string;
  total: string;
  validUntil: string | null;
  status: QuoteStatus;
  rejectionReason: string | null;
  rejectionNote: string | null;
  notes: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  sentAt: string | null;
  depositPaidAt: string | null;
  balancePaidAt: string | null;
  rejectedAt: string | null;
  items: QuoteItem[];
  // Order info (when quote is converted to order)
  orderId: string | null;
  // Payment info
  payment: QuotePayment | null;
  paymentPending: boolean;
  // Customer details (from join)
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  customerCity: string | null;
  customerState: string | null;
  customerPostalCode: string | null;
  customerShowAddress: boolean | null;
}

/**
 * Quote list item (without full items)
 */
export interface QuoteListItem {
  id: string;
  requestId: string | null;
  customerId: string;
  invoiceNumber: string | null;
  title: string | null;
  total: string;
  status: QuoteStatus;
  validUntil: string | null;
  createdAt: string;
  sentAt: string | null;
}

/**
 * Reject quote input
 */
export interface RejectQuoteInput {
  rejectionReason: string;
  rejectionNote?: string;
}

/**
 * Status display configuration
 */
export const quoteStatusConfig: Record<
  QuoteStatus,
  {
    label: string;
    textColor: string;
    borderColor: string;
    bgColor: string;
  }
> = {
  sent: {
    label: "Awaiting Deposit",
    textColor: "#813500",
    borderColor: "#FFE4D2",
    bgColor: "#FFF8F3",
  },
  deposit_paid: {
    label: "Deposit Paid",
    textColor: "#1E40AF",
    borderColor: "#BFDBFE",
    bgColor: "#EFF6FF",
  },
  paid: {
    label: "Fully Paid",
    textColor: "#395214",
    borderColor: "#B3EC3D",
    bgColor: "#FBFFF4",
  },
  rejected: {
    label: "Rejected",
    textColor: "#FF1603",
    borderColor: "#FFE1E1",
    bgColor: "#FFF8F8",
  },
  expired: {
    label: "Expired",
    textColor: "#92400E",
    borderColor: "#FDE68A",
    bgColor: "#FFFBEB",
  },
};
