"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api-client";

interface PasswordStatusResult {
  hasPassword: boolean;
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
  return useMutation({
    mutationFn: async (input: SetPasswordInput): Promise<SetPasswordResult> =>
      apiPost<SetPasswordResult>("/api/user/set-password", input),
  });
}
