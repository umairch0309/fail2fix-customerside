/**
 * Lightweight utilities for proxy (middleware)
 *
 * These functions perform OPTIMISTIC checks only - they check if a session
 * cookie exists but DO NOT verify it with the backend/database.
 *
 * Why optimistic checks?
 * - Proxy runs on EVERY route, including prefetched ones
 * - Database/backend calls in proxy create performance bottlenecks
 * - Cookie presence is enough for basic redirect logic
 *
 * For SECURE checks, always use auth-utils.ts functions in:
 * - Server Components
 * - Server Actions
 * - Route Handlers
 */

/**
 * Check if a Better Auth session cookie exists (optimistic check)
 *
 * This does NOT validate the session - it only checks if the cookie exists.
 * Use this in proxy for fast redirect decisions.
 *
 * @param cookieHeader - The cookie header from the request
 * @returns true if session cookie exists, false otherwise
 */
export function hasSessionCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) {
    return false;
  }

  // Customer portal uses "customer-auth" cookie prefix
  // Cookie name is "customer-auth.session_token"
  const sessionCookiePattern = /customer-auth\.session_token=/;
  return sessionCookiePattern.test(cookieHeader);
}

/**
 * Extract session cookie value (for debugging/logging)
 *
 * This does NOT decrypt or validate the session.
 *
 * @param cookieHeader - The cookie header from the request
 * @returns Session cookie value or null
 */
export function getSessionCookieValue(
  cookieHeader: string | null
): string | null {
  if (!cookieHeader) {
    return null;
  }

  // Match the "customer-auth.session_token" cookie
  const match = cookieHeader.match(/customer-auth\.session_token=([^;]+)/);
  return match?.[1] ?? null;
}
