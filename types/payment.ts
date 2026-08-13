/**
 * Payment Types (Customer Portal)
 * Matches backend schema
 */

/**
 * Payment Method - matches backend enum
 */
export type PaymentMethod = "card" | "bank_transfer" | "cash";

/**
 * Payment Type - deposit (10%), balance (90%), or full (legacy)
 */
export type PaymentType = "deposit" | "balance" | "full";

/**
 * Payment Status - matches backend enum
 */
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

/**
 * Payment from API
 */
export interface Payment {
  id: string;
  quoteId: string;
  orderId: string | null;
  customerId: string;
  amount: string;
  currency: string;
  method: PaymentMethod;
  type: PaymentType;
  status: PaymentStatus;
  transactionId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Deposit checkout response
 */
export interface DepositCheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
  paymentId: string;
  depositAmount: string;
  balanceAmount: string;
  total: string;
}

/**
 * Balance checkout response
 */
export interface BalanceCheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
  paymentId: string;
  balanceAmount: string;
  total: string;
}

/**
 * Quote payment status
 */
export interface QuotePaymentStatus {
  quoteId: string;
  total: string;
  depositAmount: string;
  balanceAmount: string;
  depositPaid: boolean;
  depositPaidAt: string | null;
  balancePaid: boolean;
  balancePaidAt: string | null;
  fullyPaid: boolean;
  canPayBalance: boolean;
  orderId: string | null;
  orderCompleted: boolean;
}

/**
 * Verify checkout session response
 */
export interface VerifyCheckoutResponse {
  status: "paid" | "unpaid" | "open";
  quoteId: string;
  customerId?: string;
  paymentType: PaymentType;
}

/**
 * Status display configuration
 */
export const paymentStatusConfig: Record<
  PaymentStatus,
  {
    label: string;
    textColor: string;
    borderColor: string;
    bgColor: string;
  }
> = {
  completed: {
    label: "Completed",
    textColor: "#395214",
    borderColor: "#B3EC3D",
    bgColor: "#FBFFF4",
  },
  pending: {
    label: "Pending",
    textColor: "#813500",
    borderColor: "#FFE4D2",
    bgColor: "#FFF8F3",
  },
  failed: {
    label: "Failed",
    textColor: "#FF1603",
    borderColor: "#FFE1E1",
    bgColor: "#FFF8F8",
  },
  refunded: {
    label: "Refunded",
    textColor: "#1E40AF",
    borderColor: "#BFDBFE",
    bgColor: "#EFF6FF",
  },
};

/**
 * Payment method display labels
 */
export const paymentMethodLabels: Record<PaymentMethod, string> = {
  card: "Card",
  bank_transfer: "Bank Transfer",
  cash: "Cash",
};
