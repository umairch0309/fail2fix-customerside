/** Matches Fail2Fix backend UK VRM validation. */
export const UK_VRM_REGEX =
  /^([A-Z]{2}\d{2}\s?[A-Z]{3}|[A-Z][0-9]{1,3}\s?[A-Z]{3}|[A-Z]{3}\s?[0-9]{1,3}[A-Z]|[0-9]{1,4}\s?[A-Z]{1,3}|[A-Z]{1,3}\s?[0-9]{1,4}|[A-Z]{1,2}\s?[0-9]{1,4})$/i;

export function isValidUkVrm(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 10) return false;
  return UK_VRM_REGEX.test(trimmed);
}

export function validateUkVrm(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Vehicle registration is required";
  if (trimmed.length < 2) return "Please enter a valid registration";
  if (trimmed.length > 10 || !UK_VRM_REGEX.test(trimmed)) {
    return "Please enter a valid UK vehicle registration (e.g. AB12 CDE)";
  }
  return undefined;
}
