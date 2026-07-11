"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "@/components/ui/sonner";
import { Input } from "../ui/input";
import Password from "../ui/password";
import Button from "../custombutton";
import HeadingGroup from "../headinggroup";
import { Field, FieldLabel, FieldError, FieldGroup } from "../ui/field";
import { forgetPassword, emailOtp } from "@/lib/auth-client";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import OTPComponent from "@/components/otp";

const emailSchema = z.object({
  email: z.email("Please enter a valid email address."),
});

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

type Step = "email" | "otp" | "password" | "success";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Step 1: Email form
  const emailForm = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: emailSchema },
    onSubmit: async ({ value }) => {
      setIsSendingOtp(true);
      await forgetPassword.emailOtp(
        { email: value.email },
        {
          onSuccess: () => {
            setEmail(value.email);
            setStep("otp");
            toast.success("Verification code sent to your email");
          },
          onError: (ctx) => {
            toast.error(
              ctx.error.message ||
                "Failed to send reset code. Please try again.",
            );
          },
        },
      );
      setIsSendingOtp(false);
    },
  });

  // Step 3: Password form
  const passwordForm = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    validators: { onSubmit: passwordSchema },
    onSubmit: async ({ value }) => {
      setIsResetting(true);
      await emailOtp.resetPassword(
        { email, otp, password: value.password },
        {
          onSuccess: () => {
            setStep("success");
            toast.success("Password reset successfully!");
          },
          onError: (ctx) => {
            toast.error(
              ctx.error.message ||
                "Failed to reset password. Please try again.",
            );
          },
        },
      );
      setIsResetting(false);
    },
  });

  // Step 2: OTP verification — auto-advance when 6 digits entered
  const handleOtpComplete = () => {
    setStep("password");
  };

  useEffect(() => {
    if (otp.length === 6) {
      handleOtpComplete();
    }
  }, [otp]);

  const handleResend = async () => {
    setIsResending(true);
    await forgetPassword.emailOtp(
      { email },
      {
        onSuccess: () => {
          toast.success("Verification code resent");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to resend code");
        },
      },
    );
    setIsResending(false);
  };

  // Step 4: Success
  if (step === "success") {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <HeadingGroup
          heading="Password Reset!"
          description="Your password has been reset successfully. You can now sign in with your new password."
        />
        <Button
          onClick={() => router.push("/login")}
          fullWidth
          className="py-6"
        >
          Back to Login
        </Button>
      </div>
    );
  }

  // Step 1: Enter email
  if (step === "email") {
    return (
      <div className="w-full max-w-md space-y-8">
        <HeadingGroup
          heading="Forgot Password"
          description="Enter your email address and we'll send you a code to reset your password."
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            emailForm.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup className="gap-4">
            <emailForm.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="gap-1">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-[0.85rem] font-medium text-gray-900"
                    >
                      Email
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="Enter your email"
                      className="h-12"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={isSendingOtp}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <Button
            type="submit"
            fullWidth
            className="py-6"
            loading={isSendingOtp}
            loadingText="Sending code..."
            disabled={isSendingOtp}
          >
            Send Reset Code
          </Button>
        </form>
      </div>
    );
  }

  // Step 2: Enter OTP
  if (step === "otp") {
    return (
      <div className="w-full max-w-md space-y-6">
        <button
          type="button"
          onClick={() => {
            setOtp("");
            setStep("email");
          }}
          className="flex items-center gap-1 text-sm text-[#838383] hover:text-[#272829] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <HeadingGroup
          heading="Enter Verification Code"
          description={`We've sent a 6-digit code to ${email}`}
        />
        <div className="space-y-4">
          <OTPComponent value={otp} onChange={setOtp} disabled={isVerifying} />

          <Button
            type="button"
            fullWidth
            className="py-6"
            disabled={otp.length !== 6}
            onClick={handleOtpComplete}
          >
            Continue
          </Button>
        </div>

        <p className="text-sm text-center text-[#838383]">
          Didn't receive the code?
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-[#F15D1E] font-medium hover:underline disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Resend"}
          </button>
        </p>
      </div>
    );
  }

  // Step 3: New password
  return (
    <div className="w-full max-w-md space-y-6">
      <button
        type="button"
        onClick={() => setStep("otp")}
        className="flex items-center gap-1 text-sm text-[#838383] hover:text-[#272829] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <HeadingGroup
        heading="Set New Password"
        description="Create a new secure password for your account."
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          passwordForm.handleSubmit();
        }}
        className="space-y-4"
      >
        <FieldGroup className="gap-4">
          <passwordForm.Field
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
                    disabled={isResetting}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <passwordForm.Field
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
                    disabled={isResetting}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>

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
          loading={isResetting}
          loadingText="Resetting password..."
          disabled={isResetting}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
