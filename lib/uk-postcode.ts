/** Matches Fail2Fix backend UK postcode validation. */
export const UK_POSTCODE_REGEX =
  /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0AA)$/i;

export function isValidUkPostcode(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 10) return false;
  return UK_POSTCODE_REGEX.test(trimmed);
}

export function validateUkPostcode(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Postcode is required";
  if (trimmed.length > 10 || !UK_POSTCODE_REGEX.test(trimmed)) {
    return "Please enter a valid UK postcode (e.g. SW1A 1AA)";
  }
  return undefined;
}
