import { NextRequest, NextResponse } from "next/server";
import { hasSessionCookie } from "./lib/proxy-utils";

/**
 * Next.js Proxy for Better Auth (Separate Backend Architecture)
 *
 * IMPORTANT: This proxy performs OPTIMISTIC checks only!
 * - It checks if a session cookie EXISTS
 * - It does NOT validate the session with the backend
 * - It does NOT check email verification
 *
 * Why optimistic checks?
 * - Proxy runs on EVERY route, including prefetched ones
 * - Backend calls here would create massive performance bottlenecks
 * - Cookie presence is sufficient for basic redirect logic
 *
 * Secure validation happens in:
 * - Server Components (via auth-utils.ts)
 * - Server Actions
 * - Route Handlers
 *
 * Email verification is enforced in Server Components using requireVerifiedAuth()
 */

// Protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/chats",
  "/quotes",
  "/requests",
  "/payments",
  "/orders",
];

// Auth routes that should redirect to dashboard if authenticated
const authRoutes = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check route types
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Skip session check if not an auth or protected route
  if (!isAuthRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  // Optimistic check: Does a session cookie exist?
  // This does NOT validate the session - just checks if cookie exists
  const cookieHeader = request.headers.get("cookie");
  const hasSession = hasSessionCookie(cookieHeader);

  // Redirect authenticated users away from auth pages to dashboard
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow request to proceed
  return NextResponse.next();
}

// Configure which routes this proxy runs on
export const config = {
  matcher: [
    /*
     * Match all pathnames except for
     * - … if they start with `/api`, `/_next` or `/_vercel`
     * - … the ones containing a dot (e.g. `favicon.ico`)
     */
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
