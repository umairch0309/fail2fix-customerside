/**
 * Garage Types
 * Types for garage/shop information
 */

/**
 * Garage/Shop information
 */
export interface Garage {
  id: string;
  name: string;
  logo?: string | null;
  verified: boolean;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Quotation Item (for offer details)
 */
export interface QuotationItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string | null;
}

/**
 * Offer from Garage
 */
export interface GarageOffer {
  id: string;
  garage: Garage;
  items: QuotationItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
  vatIncluded: boolean;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  validUntil?: string | null;
}
