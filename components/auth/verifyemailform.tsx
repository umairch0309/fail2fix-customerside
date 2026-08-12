"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/sonner";

import Button from "@/components/custombutton";
import HeadingGroup from "@/components/headinggroup";
import { emailOtp } from "@/lib/auth-client";
import OTPComponent from "@/components/otp";



const VerifyEmailForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || ""; 

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    await emailOtp.verifyEmail(
      {
        email,
        otp,
      },
      {
        onSuccess: () => {
          toast.success("Email verified successfully!");
          const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
          router.push(callbackUrl.startsWith("/") ? callbackUrl : "/dashboard");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Verification failed. Please try again.");
        },
      }
    );
    setIsLoading(false);
  };

  const handleResend = async () => {
    setIsResending(true);
    await emailOtp.sendVerificationOtp(
      {
        email,
        type: "email-verification",
      },
      {
        onSuccess: () => {
          toast.success("Verification code sent");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to resend code");
        },
      }
    );
    setIsResending(false);
  };

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);

  return (
    <div className="w-full max-w-md space-y-6">
      <HeadingGroup
        heading="Verify your email"
        description={`We've sent a 6-digit code to ${email || "your email"}`}
      />

      <div className="space-y-4">
        <OTPComponent
          value={otp}
          onChange={setOtp}
          disabled={isLoading}
        />

        <Button
          type="button"
          fullWidth
          className="py-6"
          loading={isLoading}
          loadingText="Verifying..."
          disabled={isLoading || otp.length !== 6}
          onClick={handleVerify}
        >
          Verify Email
        </Button>

      </div>

      <p className="text-sm text-center text-[#838383] absolute bottom-8 left-0 right-0">
        Didn&apos;t receive the code?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || isLoading}
          className="text-[#F15D1E] font-medium hover:underline disabled:opacity-50"
        >
          {isResending ? "Sending..." : "Resend"}
        </button>
      </p>
    </div>
  );
};

export default VerifyEmailForm;
