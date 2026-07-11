import { normalizeEnquiryEmail, normalizeEnquiryVrm } from "./enquiry-dedupe";

const SESSION_KEY_PREFIX = "fail2fix:enquiry:";
const SESSION_TTL_MS = 10 * 60 * 1000;

function buildSessionKey(email: string, vrm: string): string {
  return `${SESSION_KEY_PREFIX}${normalizeEnquiryEmail(email)}:${normalizeEnquiryVrm(vrm)}`;
}

export function hasRecentClientEnquiry(email: string, vrm: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(buildSessionKey(email, vrm));
    if (!raw) return false;
    const submittedAt = Number(raw);
    return Number.isFinite(submittedAt) && Date.now() - submittedAt < SESSION_TTL_MS;
  } catch {
    return false;
  }
}

export function markClientEnquirySubmitted(email: string, vrm: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(buildSessionKey(email, vrm), String(Date.now()));
  } catch {
    // ignore storage errors
  }
}
