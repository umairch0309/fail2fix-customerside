"use client";

import { signIn } from "@/lib/auth-client";

/**
 * Start Google OAuth via Better Auth (proxied through /api/auth).
 * callbackPath must be a same-origin path (e.g. /dashboard).
 */
export async function signInWithGoogle(
  callbackPath: string,
  onError: (message: string) => void,
): Promise<void> {
  const path = callbackPath.startsWith("/") ? callbackPath : "/dashboard";
  const callbackURL = `${window.location.origin}${path}`;

  await signIn.social(
    {
      provider: "google",
      callbackURL,
      newUserCallbackURL: callbackURL,
      errorCallbackURL: `${window.location.origin}/login?error=google`,
    },
    {
      onError: (ctx) => {
        const message = ctx.error.message || "Google sign in failed.";
        const looksDisabled =
          /google|oauth|provider|client.?id|not.?configured|disabled/i.test(
            message,
          ) &&
          /missing|invalid|disabled|not.?configured|not.?found/i.test(message);

        onError(
          looksDisabled
            ? "Google sign-in is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to the backend .env."
            : message,
        );
      },
    },
  );
}
