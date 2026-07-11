import { createAuthClient } from "better-auth/react";
import { emailOTPClient, magicLinkClient } from "better-auth/client/plugins";
import { API_URL } from "./constants";

/**
 * Better Auth Client for Customer Portal
 * Uses customer-specific auth endpoint with different cookie prefix
 * This allows customer and admin to be logged in simultaneously
 *
 * Cookie: customer-auth.session_token
 * Endpoint: /api/auth/*
 *
 * Usage:
 * - authClient.signIn.email({ email, password })
 * - authClient.signIn.social({ provider: "google" })
 * - authClient.signIn.emailOtp({ email, otp }) - Sign in with OTP
 * - authClient.signIn.magicLink({ email }) - Sign in with magic link
 * - authClient.signUp.email({ name, email, password })
 * - authClient.signOut()
 * - authClient.useSession()
 * - authClient.emailOtp.sendVerificationOtp({ email, type }) - Send OTP
 * - authClient.emailOtp.verifyEmail({ email, otp }) - Verify email with OTP
 * - authClient.forgetPassword.emailOtp({ email }) - Send password reset OTP
 * - authClient.emailOtp.resetPassword({ email, otp, password }) - Reset password
 * - authClient.setPassword({ password }) - Set password for users without one
 */
export const authClient = createAuthClient({
  baseURL: `${API_URL}/api/auth`, // Customer-specific auth endpoint
  fetchOptions: {
    credentials: 'include', // Required for cross-origin cookie handling
  },
  plugins: [emailOTPClient(), magicLinkClient()],
});

// Export individual methods for convenience
export const { signIn, signUp, signOut, useSession, emailOtp, forgetPassword } = authClient;

// Export types using Better Auth's $Infer property
export type Session = typeof authClient.$Infer.Session;

export default authClient;
