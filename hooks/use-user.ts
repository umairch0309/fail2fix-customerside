"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch, apiPost } from "@/lib/api-client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  showAddress: boolean | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  hasPassword: boolean;
}

interface PasswordStatusResult {
  hasPassword: boolean;
}

export function useUserProfile() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async (): Promise<UserProfile> => apiGet<UserProfile>("/api/user/me"),
    staleTime: 30 * 1000,
  });
}

export type UpdateProfileInput = {
  name?: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProfileInput): Promise<UserProfile> =>
      apiPatch<UserProfile>("/api/user/me", input),
    onSuccess: (profile) => {
      queryClient.setQueryData(["user", "me"], profile);
      queryClient.invalidateQueries({ queryKey: ["user", "password-status"] });
    },
  });
}

export function usePasswordStatus() {
  return useQuery({
    queryKey: ["user", "password-status"],
    queryFn: async (): Promise<PasswordStatusResult> =>
      apiGet<PasswordStatusResult>("/api/user/password-status"),
    staleTime: 60 * 1000,
    retry: false,
  });
}

interface SetPasswordInput {
  newPassword: string;
}

interface SetPasswordResult {
  message: string;
}

export function useSetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SetPasswordInput): Promise<SetPasswordResult> =>
      apiPost<SetPasswordResult>("/api/user/set-password", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "password-status"] });
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
}
