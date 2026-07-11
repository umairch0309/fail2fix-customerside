export const DUPLICATE_ENQUIRY_WINDOW_MS = 10 * 60 * 1000;

export const normalizeEnquiryEmail = (email: string): string =>
  email.toLowerCase().trim();

export const normalizeEnquiryVrm = (vrm: string): string =>
  vrm.toUpperCase().replace(/\s+/g, "");
