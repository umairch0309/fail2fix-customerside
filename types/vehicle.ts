/**
 * Vehicle & MOT Types
 * Matches backend API response
 */

/**
 * MOT Defect Type - matches MOT History API response (uppercase)
 */
export type MotDefectType = "DANGEROUS" | "MAJOR" | "MINOR" | "ADVISORY" | "FAIL";

/**
 * Vehicle (main type)
 */
export interface Vehicle {
  id: string;
  vrm: string;

  // Basic vehicle information
  make?: string | null;
  model?: string | null;
  fuelType?: string | null;
  engineSize?: string | null;
  primaryColour?: string | null;

  // Full DVLA API response
  dvlaData?: any | null;

  // Cache control
  lastFetchedAt: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Optional relations
  latestMotTest?: MotTestWithDefects | null;
}

/**
 * MOT Test
 */
export interface MotTest {
  id: string;
  vehicleId: string;

  // MOT test identification
  motTestNumber: string;

  // Test details
  completedDate: string;
  testResult: string;
  expiryDate?: string | null;
  odometerValue?: number | null;
  odometerUnit: string;

  // Raw MOT data from DVLA API
  rawData?: any | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * MOT Test with defects (joined)
 */
export interface MotTestWithDefects extends MotTest {
  defects: MotDefect[];
}

/**
 * MOT Defect
 */
export interface MotDefect {
  id: string;
  motTestId: string;

  // Defect details
  text: string;
  type: MotDefectType;
  dangerous: boolean;

  // Raw defect data from DVLA API
  rawData?: any | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * MOT Defect with suggested part (from VRM lookup)
 * Used in VRM lookup response
 */
export interface MotDefectWithPricing {
  id: string;
  text: string;
  type: MotDefectType;
  dangerous: boolean;
  suggestedPart: {
    name: string;
    category: string;
  } | null;
}

/**
 * Parts Catalog
 */
export interface PartsCatalog {
  id: string;

  // Part/repair details
  name: string;
  category: string;
  description?: string | null;

  // Pricing
  basePrice: string;
  laborHours?: string | null;

  // Matching patterns
  matchPatterns?: string[] | null;

  // Status
  active: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Request Defect Selection
 */
export interface RequestDefectSelection {
  id: string;
  requestId: string;
  motDefectId: string;
  partsCatalogId?: string | null;

  // Price snapshot
  priceSnapshot?: string | null;

  // Additional notes
  notes?: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Joined data
  defectText?: string;
  defectType?: MotDefectType;
  defectDangerous?: boolean;
  partName?: string | null;
  partCategory?: string | null;
  partDescription?: string | null;
}

/**
 * VRM Lookup Vehicle (simplified from public API)
 */
export interface VrmLookupVehicle {
  vrm: string;
  make: string;
  model: string;
  primaryColour: string;
  fuelType: string;
  engineSize: string | null;
  firstUsedDate: string;
}

/**
 * VRM Lookup MOT Test (simplified from public API)
 */
export interface VrmLookupMotTest {
  id: string;
  testDate: string;
  expiryDate: string | null;
  result: string;
  mileage: number | null;
}

/**
 * VRM Lookup Response (from GET /api/vehicles/lookup/:vrm)
 */
export interface VrmLookupResponse {
  vehicle: VrmLookupVehicle;
  motTest: VrmLookupMotTest | null;
  defects: MotDefectWithPricing[];
}

/**
 * Create Request with Defects Input (public form)
 */
export interface CreateRequestWithDefectsInput {
  // Contact details
  name: string;
  email: string;
  phone: string;

  // Vehicle details
  vrm: string;
  postcode: string;

  // Selected defects
  selectedDefectIds: string[];

  // Optional notes
  notes?: string;
}

/**
 * Instant Quote Calculation
 */
export interface InstantQuoteCalculation {
  items: Array<{
    defectId: string;
    defectText: string;
    partId: string | null;
    partName: string | null;
    price: number;
  }>;
  subtotal: number;
  serviceFee: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

/**
 * Create Request with Defects Response (from public form submission)
 */
export interface CreateRequestWithDefectsResponse {
  customerId: string;
  requestId: string;
  quoteId: string;
  isNewCustomer: boolean;
  isDuplicate?: boolean;
  message: string;
}

/**
 * Defect type configuration (for badges, colors, etc.)
 * Keys match MOT History API response (uppercase)
 */
export const defectTypeConfig: Record<
  MotDefectType,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  DANGEROUS: {
    label: "DANGEROUS",
    color: "#DC2626",
    bgColor: "#FEE2E2",
    borderColor: "#FCA5A5",
  },
  MAJOR: {
    label: "MAJOR",
    color: "#EA580C",
    bgColor: "#FFEDD5",
    borderColor: "#FED7AA",
  },
  MINOR: {
    label: "MINOR",
    color: "#D97706",
    bgColor: "#FEF3C7",
    borderColor: "#FDE68A",
  },
  ADVISORY: {
    label: "ADVISORY",
    color: "#2563EB",
    bgColor: "#DBEAFE",
    borderColor: "#BFDBFE",
  },
  FAIL: {
    label: "FAIL",
    color: "#DC2626",
    bgColor: "#FEE2E2",
    borderColor: "#FCA5A5",
  },
};
