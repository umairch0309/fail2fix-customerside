import { createAuthClient } from "better-auth/react";
import { emailOTPClient, magicLinkClient } from "better-auth/client/plugins";
import { API_URL } from "./constants";

/**
 * Same-origin auth base in the browser (via app/api/auth proxy → backend).
 * Server components still talk to the absolute API URL when needed.
 */
const authBaseURL =
  typeof window !== "undefined"
    ? `${window.location.origin}/api/auth`
    : `${API_URL}/api/auth`;

/**
 * Better Auth Client for Customer Portal
 * Uses customer-specific auth endpoint with different cookie prefix
 * This allows customer and admin to be logged in simultaneously
 *
 * Cookie: customer-auth.session_token
 * Endpoint: /api/auth/*
 */
export const authClient = createAuthClient({
  baseURL: authBaseURL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [emailOTPClient(), magicLinkClient()],
});

// Export individual methods for convenience
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  emailOtp,
  forgetPassword,
  updateUser,
  changePassword,
} = authClient;

// Export types using Better Auth's $Infer property
export type Session = typeof authClient.$Infer.Session;

export default authClient;
