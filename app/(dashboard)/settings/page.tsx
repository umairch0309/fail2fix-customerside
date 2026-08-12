"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { KeyRound, ShieldCheck } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { changePassword } from "@/lib/auth-client";
import { usePasswordStatus, useSetPassword } from "@/hooks/use-user";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import Password from "@/components/ui/password";
import Button from "@/components/custombutton";
import { toast } from "@/components/ui/sonner";
import { ApiError } from "@/lib/api-client";

const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.");

const setPasswordSchema = z
  .object({
    password: passwordRules,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    password: passwordRules,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function SettingsPage() {
  const setHeader = useDashboardStore((state) => state.setHeader);
  const { data: passwordStatus, isLoading, refetch } = usePasswordStatus();
  const { mutate: setPassword, isPending: isSettingPassword } = useSetPassword();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const hasPassword = passwordStatus?.hasPassword ?? false;

  useEffect(() => {
    setHeader({
      title: "Settings",
      description: "Manage your password and account security",
      showBreadcrumbs: false,
      showButton: false,
    });
  }, [setHeader]);

  const setForm = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: setPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setPassword(
        { newPassword: value.password },
        {
          onSuccess: () => {
            toast.success("Password set successfully");
            setForm.reset();
            refetch();
          },
          onError: (error) => {
            toast.error(
              error instanceof ApiError || error instanceof Error
                ? error.message
                : "Failed to set password"
            );
          },
        }
      );
    },
  });

  const changeForm = useForm({
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: changePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setIsChangingPassword(true);
      try {
        const { error } = await changePassword({
          currentPassword: value.currentPassword,
          newPassword: value.password,
          revokeOtherSessions: false,
        });
        if (error) {
          toast.error(error.message || "Failed to change password");
          return;
        }
        toast.success("Password updated");
        changeForm.reset();
        refetch();
      } catch {
        toast.error("Failed to change password");
      } finally {
        setIsChangingPassword(false);
      }
    },
  });

  return (
    <div className="space-y-6 px-3 pb-3 md:px-5 md:pb-4">
      <div className="max-w-xl rounded-xl border border-[#EAEAEA] bg-white p-5 md:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF4EB]">
            <KeyRound className="h-5 w-5 text-[#FD6900]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#494F57]">Password</h2>
            <p className="mt-0.5 text-sm text-[#97999D]">
              {isLoading
                ? "Checking password status..."
                : hasPassword
                  ? "Update your password to keep your account secure."
                  : "You signed in without a password. Set one to enable email login."}
            </p>
          </div>
        </div>

        {!isLoading && (
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[#F5F5F5] px-2.5 py-1 text-xs font-medium text-[#494F57]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#81868C]" />
            {hasPassword ? "Password enabled" : "No password set"}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#FD6900]" />
          </div>
        ) : hasPassword ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              changeForm.handleSubmit();
            }}
            className="space-y-4 border-t border-[#EAEAEA] pt-5"
          >
            <FieldGroup className="gap-4">
              <changeForm.Field
                name="currentPassword"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-[0.85rem] font-medium text-gray-900"
                      >
                        Current password
                      </FieldLabel>
                      <Password
                        id={field.name}
                        name={field.name}
                        placeholder="Enter current password"
                        className="h-11"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(value) => field.handleChange(value)}
                        aria-invalid={isInvalid}
                        disabled={isChangingPassword}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <changeForm.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-[0.85rem] font-medium text-gray-900"
                      >
                        New password
                      </FieldLabel>
                      <Password
                        id={field.name}
                        name={field.name}
                        placeholder="Enter new password"
                        className="h-11"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(value) => field.handleChange(value)}
                        aria-invalid={isInvalid}
                        disabled={isChangingPassword}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <changeForm.Field
                name="confirmPassword"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-[0.85rem] font-medium text-gray-900"
                      >
                        Confirm new password
                      </FieldLabel>
                      <Password
                        id={field.name}
                        name={field.name}
                        placeholder="Confirm new password"
                        className="h-11"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(value) => field.handleChange(value)}
                        aria-invalid={isInvalid}
                        disabled={isChangingPassword}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                type="submit"
                className="py-5"
                loading={isChangingPassword}
                loadingText="Updating..."
                disabled={isChangingPassword}
              >
                Update password
              </Button>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#FD6900] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setForm.handleSubmit();
            }}
            className="space-y-4 border-t border-[#EAEAEA] pt-5"
          >
            <FieldGroup className="gap-4">
              <setForm.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-[0.85rem] font-medium text-gray-900"
                      >
                        New password
                      </FieldLabel>
                      <Password
                        id={field.name}
                        name={field.name}
                        placeholder="Enter new password"
                        className="h-11"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(value) => field.handleChange(value)}
                        aria-invalid={isInvalid}
                        disabled={isSettingPassword}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <setForm.Field
                name="confirmPassword"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-[0.85rem] font-medium text-gray-900"
                      >
                        Confirm password
                      </FieldLabel>
                      <Password
                        id={field.name}
                        name={field.name}
                        placeholder="Confirm new password"
                        className="h-11"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(value) => field.handleChange(value)}
                        aria-invalid={isInvalid}
                        disabled={isSettingPassword}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>

            <p className="text-xs text-[#97999D]">
              Use at least 8 characters with uppercase, lowercase, and a number.
            </p>

            <Button
              type="submit"
              className="py-5"
              loading={isSettingPassword}
              loadingText="Setting password..."
              disabled={isSettingPassword}
            >
              Set password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
