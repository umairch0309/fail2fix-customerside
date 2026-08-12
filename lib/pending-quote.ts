/**
 * Persist a marketing quote draft across the Sign In redirect.
 * Request is only created after the customer authenticates.
 */

export type PendingQuotePayload = {
  name: string;
  email: string;
  phone: string;
  vrm: string;
  postcode: string;
  notes?: string;
  selectedDefectIds: string[];
  /** Stable match key when lookup regenerates defect UUIDs */
  selectedDefectTexts: string[];
  createdAt: number;
};

const STORAGE_KEY = "fail2fix:pending-quote";
const TTL_MS = 60 * 60 * 1000; // 1 hour
export const RESUME_QUOTE_PARAM = "resumeQuote";

export function savePendingQuote(
  payload: Omit<PendingQuotePayload, "createdAt">,
): void {
  if (typeof window === "undefined") return;
  try {
    const value: PendingQuotePayload = {
      ...payload,
      createdAt: Date.now(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

export function getPendingQuote(): PendingQuotePayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingQuotePayload;
    if (!parsed?.email || !parsed?.vrm || !Array.isArray(parsed.selectedDefectIds)) {
      clearPendingQuote();
      return null;
    }
    if (!Number.isFinite(parsed.createdAt) || Date.now() - parsed.createdAt > TTL_MS) {
      clearPendingQuote();
      return null;
    }
    return parsed;
  } catch {
    clearPendingQuote();
    return null;
  }
}

export function clearPendingQuote(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function hasPendingQuote(): boolean {
  return getPendingQuote() !== null;
}

/** Build /login URL that resumes quote submission after auth. */
export function buildQuoteSignInUrl(email: string): string {
  const callbackUrl = `/dashboard?${RESUME_QUOTE_PARAM}=1`;
  const params = new URLSearchParams({
    email: email.trim(),
    callbackUrl,
  });
  return `/login?${params.toString()}`;
}

export function buildQuoteSignUpUrl(email: string, name?: string): string {
  const callbackUrl = `/dashboard?${RESUME_QUOTE_PARAM}=1`;
  const params = new URLSearchParams({
    email: email.trim(),
    callbackUrl,
  });
  if (name?.trim()) params.set("name", name.trim());
  return `/signup?${params.toString()}`;
}
