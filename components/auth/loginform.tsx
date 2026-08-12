"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "../ui/input";
import Password from "../ui/password";
import Button from "../custombutton";
import Google from "@/public/icons/google";
import HeadingGroup from "../headinggroup";
import { Field, FieldLabel, FieldError, FieldGroup } from "../ui/field";
import { signIn, signOut, emailOtp, authClient } from "@/lib/auth-client";
import { signInWithGoogle } from "@/lib/google-auth";
import Link from "next/link";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const Loginform = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Get email / callback from quote redirect or protected-route gate
  const emailFromParams = searchParams.get("email") || "";
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const safeCallbackUrl = callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";

  useEffect(() => {
    if (searchParams.get("error") === "google") {
      toast.error("Google sign-in failed. Please try again or use email.");
    }
  }, [searchParams]);

  const form = useForm({
    defaultValues: {
      email: emailFromParams,
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      await signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: async () => {
            // Fetch session to get user role (sign-in response doesn't include custom fields)
            const { data: session } = await authClient.getSession();

            if (!session?.user) {
              toast.error(
                "Signed in, but session cookie was not set. Please try again or clear site cookies.",
              );
              setIsLoading(false);
              return;
            }

            const role = (session.user as { role?: string })?.role;

            if (role === "admin") {
              // Sign out admin users immediately - they should use the admin panel
              await signOut();
              toast.error("Access denied. Please use the admin panel.");
              setIsLoading(false);
              return;
            }
            toast.success("Successfully signed in");
            router.push(safeCallbackUrl);
            router.refresh();
          },
          onError: async (ctx) => {
            // Check if error is due to unverified email
            if (ctx.error.code === "EMAIL_NOT_VERIFIED") {
              // Send verification OTP and redirect to verify page
              await emailOtp.sendVerificationOtp({
                email: value.email,
                type: "email-verification",
              });
              toast.info("Please verify your email first");
              const verifyParams = new URLSearchParams({
                email: value.email,
                callbackUrl: safeCallbackUrl,
              });
              router.push(`/verify-email?${verifyParams.toString()}`);
            } else {
              toast.error(
                ctx.error.message || "Login failed. Please try again.",
              );
            }
          },
        },
      );
      setIsLoading(false);
    },
  });

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle(safeCallbackUrl, (message) => {
        toast.error(message);
        setIsGoogleLoading(false);
      });
    } catch {
      toast.error("Google sign in failed.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <HeadingGroup
        heading="Welcome Back"
        description="Sign in to manage your MOT repairs and get instant garage quotes"
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
                    disabled={isLoading || isGoogleLoading}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="gap-1">
                  <div className="flex justify-between">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-[0.85rem] font-medium text-gray-900"
                    >
                      Password
                    </FieldLabel>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-[0.75rem] font-medium text-gray-600 hover:text-gray-900"
                    >
                      <Link href={"/forgot-password"}>Forgot password</Link>
                    </FieldLabel>
                  </div>
                  <Password
                    id={field.name}
                    name={field.name}
                    placeholder="Enter your password"
                    className="h-12"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(value) => field.handleChange(value)}
                    aria-invalid={isInvalid}
                    disabled={isLoading || isGoogleLoading}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>

        <Button
          type="submit"
          fullWidth
          className="py-6"
          loading={isLoading}
          loadingText="Signing in..."
          disabled={isLoading || isGoogleLoading}
        >
          Login
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[#E0E0E0]" />
          <span className="text-sm text-[#838383]">or</span>
          <div className="flex-1 h-px bg-[#E0E0E0]" />
        </div>

        <Button
          type="button"
          fullWidth
          normalColor="#FFFFFF"
          textColor="#272829"
          loadingColor="#f5f5f5"
          loadingTextColor="#272829"
          loadingText="Connecting..."
          className="border border-[#E0E0E0] py-6 hover:bg-[#f0f0f0]"
          onClick={handleGoogleSignIn}
          loading={isGoogleLoading}
          disabled={isLoading || isGoogleLoading}
        >
          <Google />
          Continue with Google
        </Button>
      </form>
    </div>
  );
};

export default Loginform;
