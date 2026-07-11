/**
 * Request Types
 * Matches backend schema (request.schema.ts)
 */

/**
 * Request Status - matches backend enum
 */
export type RequestStatus =
  | "quote_requested"
  | "quote_sent"
  | "paid"
  | "rejected"
  | "closed";

/**
 * Quote item for request detail view
 */
export interface RequestQuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  total: string;
}

/**
 * Quote info for request detail view
 */
export interface RequestQuote {
  id: string;
  status: string;
  title: string | null;
  total: string;
  items: RequestQuoteItem[];
}

/**
 * Request (main type)
 */
export interface Request {
  id: string;
  customerId: string;

  // Contact details
  name: string;
  email: string;
  phone: string;

  // Vehicle & location
  vrm: string;
  postcode: string;

  // Vehicle & MOT references
  vehicleId?: string | null;
  motTestId?: string | null;

  // MOT details
  motDetailsUrl?: string | null;
  notes?: string | null;

  // Status
  status: RequestStatus;

  // Admin who created (for CRM mode)
  createdBy?: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Relations (optional, when included)
  customer?: {
    id: string;
    name: string;
    email: string;
  };

  // Associated quote with items (selected defects)
  quote?: RequestQuote | null;
}

/**
 * Create Request Input
 * Matches backend validation schema
 */
export interface CreateRequestInput {
  name: string;
  email: string;
  phone: string;
  vrm: string;
  postcode: string;
  motDetailsUrl?: string;
  notes?: string;
}

/**
 * Request List Response from API
 */
export interface RequestListResponse {
  requests: Request[];
  total: number;
}

/**
 * Status display configuration
 */
export const requestStatusConfig: Record<
  RequestStatus,
  {
    label: string;
    textColor: string;
    statusColor: string;
    borderColor: string;
    bgColor: string;
  }
> = {
  quote_requested: {
    label: "Quote Requested",
    textColor: "#813500",
    statusColor: "#F97316",
    borderColor: "#FFE4D2",
    bgColor: "#FFF8F3",
  },
  quote_sent: {
    label: "Quote Sent",
    textColor: "#1E40AF",
    statusColor: "#3B82F6",
    borderColor: "#DBEAFE",
    bgColor: "#EFF6FF",
  },
  paid: {
    label: "Paid",
    textColor: "#395214",
    statusColor: "#B3EC3D",
    borderColor: "#B3EC3D",
    bgColor: "#FBFFF4",
  },
  rejected: {
    label: "Rejected",
    textColor: "#FF1603",
    statusColor: "#FF1603",
    borderColor: "#FFE1E1",
    bgColor: "#FFF8F8",
  },
  closed: {
    label: "Closed",
    textColor: "#6B7280",
    statusColor: "#9CA3AF",
    borderColor: "#E5E7EB",
    bgColor: "#F9FAFB",
  },
};
