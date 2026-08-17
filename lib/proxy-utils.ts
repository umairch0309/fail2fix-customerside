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

const CUSTOMER_AUTH_COOKIE_NAMES = [
  "customer-auth.session_token",
  "customer-auth.session_data",
  "__Secure-customer-auth.session_token",
  "__Secure-customer-auth.session_data",
];

/**
 * Expire customer session cookies. Must match production attributes
 * (Secure + SameSite=None, optional __Secure- prefix) or the browser
 * will keep the stale cookie and auth pages bounce back to /login.
 */
export function clearCustomerAuthCookies(response: {
  cookies: { set: (name: string, value: string, options: Record<string, unknown>) => void };
}): void {
  const attributeSets: Record<string, unknown>[] = [
    { path: "/", maxAge: 0 },
    { path: "/", maxAge: 0, secure: true, sameSite: "none" },
    { path: "/", maxAge: 0, secure: true, sameSite: "lax" },
    {
      path: "/",
      maxAge: 0,
      secure: true,
      sameSite: "none",
      domain: ".fail2fix.co.uk",
    },
  ];

  for (const name of CUSTOMER_AUTH_COOKIE_NAMES) {
    for (const attrs of attributeSets) {
      response.cookies.set(name, "", attrs);
    }
  }
}
