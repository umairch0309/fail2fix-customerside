import "server-only";
import { cache } from "react";
import { getSession } from "@/lib/auth-utils";

/**
 * DTOs - Safe user data for components
 * Only expose necessary fields, never sensitive data
 */

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string;
  image?: string | null;
}

export interface UserNavDTO {
  name: string;
  email: string;
  image?: string | null;
}

/**
 * Get user data for UI display
 */
export const getUser = cache(async (): Promise<UserDTO | null> => {
  const session = await getSession();
  if (!session?.user) return null;

  const { id, name, email, emailVerified, role, image } = session.user;
  return { id, name, email, emailVerified, role, image };
});

/**
 * Get minimal user data for nav/header
 */
export const getUserNav = cache(async (): Promise<UserNavDTO | null> => {
  const session = await getSession();
  if (!session?.user) return null;

  const { name, email, image } = session.user;
  return { name, email, image };
});
