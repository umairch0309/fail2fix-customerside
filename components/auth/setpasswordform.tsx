"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "@/components/ui/sonner";
import Password from "../ui/password";
import Button from "../custombutton";
import HeadingGroup from "../headinggroup";
import { Field, FieldLabel, FieldError, FieldGroup } from "../ui/field";
import { useSession } from "@/lib/auth-client";
import { useSetPassword } from "@/hooks/use-user";
import { CheckCircle2, AlertCircle } from "lucide-react";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const SetPasswordForm = () => {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();
  const { mutate: setPassword, isPending: isSettingPassword } = useSetPassword();
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.push("/login");
    }
  }, [isSessionLoading, session, router]);

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: passwordSchema,
    },
    onSubmit: async ({ value }) => {
      setPassword(
        { newPassword: value.password },
        {
          onSuccess: () => {
            setIsSuccess(true);
            toast.success("Password set successfully!");
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              router.push("/dashboard");
            }, 1500);
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : "Failed to set password"
            );
          },
        }
      );
    },
  });

  // Show loading while checking session
  if (isSessionLoading) {
    return (
      <div className="w-full max-w-md flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FD6900]" />
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <HeadingGroup
          heading="Session Expired"
          description="Please sign in again to set your password."
        />
        <Button onClick={() => router.push("/login")} fullWidth className="py-6">
          Go to Login
        </Button>
      </div>
    );
  }

  // Show success state after password is set
  if (isSuccess) {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <HeadingGroup
          heading="Password Set!"
          description="Your password has been set successfully. Redirecting to dashboard..."
        />
      </div>
    );
  }

  // Show password form
  return (
    <div className="w-full max-w-md space-y-6">
      <HeadingGroup
        heading="Set Your Password"
        description={`Welcome ${session.user?.name || ""}! Create a secure password to complete your account setup.`}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <FieldGroup className="gap-4">
          <form.Field
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
                    New Password
                  </FieldLabel>
                  <Password
                    id={field.name}
                    name={field.name}
                    placeholder="Enter your new password"
                    className="h-12"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(value) => field.handleChange(value)}
                    aria-invalid={isInvalid}
                    disabled={isSettingPassword}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
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
                    Confirm Password
                  </FieldLabel>
                  <Password
                    id={field.name}
                    name={field.name}
                    placeholder="Confirm your new password"
                    className="h-12"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(value) => field.handleChange(value)}
                    aria-invalid={isInvalid}
                    disabled={isSettingPassword}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>

        {/* Password requirements hint */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>Password must:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>Be at least 8 characters long</li>
            <li>Contain at least one uppercase letter</li>
            <li>Contain at least one lowercase letter</li>
            <li>Contain at least one number</li>
          </ul>
        </div>

        <Button
          type="submit"
          fullWidth
          className="py-6"
          loading={isSettingPassword}
          loadingText="Setting password..."
          disabled={isSettingPassword}
        >
          Set Password
        </Button>
      </form>
    </div>
  );
};

export default SetPasswordForm;
