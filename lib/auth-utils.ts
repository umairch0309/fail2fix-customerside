import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { headers as getHeaders } from "next/headers";
import { API_URL } from "./constants";

/**
 * Server-Side Auth Utilities for Separate Backend Architecture
 *
 * Since Better Auth runs on a separate backend (port 3007), these utilities
 * validate sessions by making API calls to the backend.
 *
 * Use in: Server Components, Server Actions, Route Handlers
 *
 * All functions use React.cache() to deduplicate requests per render pass.
 */

/**
 * Session type from Better Auth
 */
export interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    role: string;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
  };
}

/**
 * Fetch session from backend - internal helper
 */
async function fetchSession(cookie: string | null): Promise<Session | null> {
  try {
    const res = await fetch(`${API_URL}/api/auth/get-session`, {
      headers: { cookie: cookie || "" },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.user || !data.session) return null;

    return data as Session;
  } catch {
    return null;
  }
}

/**
 * Get session - returns null if not authenticated
 *
 * Cached per request to prevent duplicate backend calls.
 *
 * @example
 * const session = await getSession();
 * if (!session) return <LoginButton />;
 * return <div>Welcome {session.user.name}</div>;
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const headers = await getHeaders();
  return fetchSession(headers.get("cookie"));
});

/**
 * Require auth - redirects to login if not authenticated
 *
 * @param redirectTo - URL to redirect if not authenticated (default: "/login")
 *
 * @example
 * export default async function Dashboard() {
 *   const { user } = await requireAuth();
 *   return <div>Welcome {user.name}</div>;
 * }
 */
export async function requireAuth(redirectTo = "/login"): Promise<Session> {
  const session = await getSession();
  if (!session) {
    // forceLogin tells the proxy to clear a stale session cookie and stop
    // /login ↔ /dashboard redirect loops.
    const url =
      redirectTo === "/login" || redirectTo.startsWith("/login?")
        ? "/login?forceLogin=1"
        : redirectTo;
    redirect(url);
  }
  return session;
}

/**
 * Require verified auth - redirects if not authenticated or email not verified
 *
 * Redirects to /verify-email if authenticated but email not verified.
 *
 * @param redirectTo - URL to redirect if not authenticated (default: "/login")
 *
 * @example
 * export default async function ProtectedPage() {
 *   const { user } = await requireVerifiedAuth();
 *   return <div>Verified user: {user.name}</div>;
 * }
 */
export async function requireVerifiedAuth(redirectTo = "/login"): Promise<Session> {
  const session = await requireAuth(redirectTo);
  if (!session.user.emailVerified) {
    redirect(`/verify-email?email=${encodeURIComponent(session.user.email)}`);
  }
  return session;
}

/**
 * Require role - redirects if user doesn't have required role
 *
 * @param role - Single role or array of allowed roles
 * @param redirectTo - URL to redirect if role check fails (default: "/dashboard")
 *
 * @example
 * // Single role
 * const { user } = await requireRole("admin");
 *
 * // Multiple roles
 * const { user } = await requireRole(["admin", "moderator"]);
 */
export async function requireRole(
  role: string | string[],
  redirectTo = "/dashboard"
): Promise<Session> {
  const session = await requireAuth();
  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(session.user.role)) {
    // Wrong portal role (e.g. admin cookie on customer app) — clear and login
    redirect(
      redirectTo === "/login" || redirectTo.startsWith("/login")
        ? "/login?forceLogin=1"
        : redirectTo,
    );
  }
  return session;
}

/**
 * Sign out - invalidates session on backend
 *
 * Call from a Server Action, then redirect.
 *
 * @example
 * "use server";
 * export async function handleSignOut() {
 *   await signOut();
 *   redirect("/");
 * }
 */
export async function signOut(): Promise<void> {
  const headers = await getHeaders();
  const cookie = headers.get("cookie");

  await fetch(`${API_URL}/api/auth/sign-out`, {
    method: "POST",
    headers: { cookie: cookie || "" },
    credentials: "include",
  });
}
