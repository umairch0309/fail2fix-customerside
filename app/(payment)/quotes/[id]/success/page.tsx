"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useVerifyCheckout } from "@/hooks/use-payments";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { useSession } from "@/lib/auth-client";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import CustomButton from "@/components/custombutton";
import Link from "next/link";
import { motion } from "motion/react";

export default function PaymentSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isPending: sessionPending } = useSession();

  const quoteId = params.id as string;
  const sessionId = searchParams.get("session_id");
  const paymentTypeParam = searchParams.get("type") as
    | "deposit"
    | "balance"
    | null;

  const { data: verifyResult, isLoading, error } = useVerifyCheckout(
    sessionId || undefined,
  );
  const paymentType = verifyResult?.paymentType || paymentTypeParam || "full";
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const isLoggedIn = Boolean(session?.user);

  useEffect(() => {
    if (verifyResult?.status === "paid") {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.quotes.detail(quoteId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    }
  }, [verifyResult, queryClient, quoteId]);

  useEffect(() => {
    if (verifyResult?.status !== "paid" || !isLoggedIn) return;

    const interval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [verifyResult?.status, isLoggedIn]);

  useEffect(() => {
    if (
      verifyResult?.status !== "paid" ||
      !isLoggedIn ||
      redirectCountdown > 0
    ) {
      return;
    }
    router.push("/orders");
  }, [verifyResult?.status, isLoggedIn, redirectCountdown, router]);

  if (isLoading || sessionPending) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <Loader2 className="mb-6 h-16 w-16 animate-spin text-[#B3EC3D]" />
        <h2 className="mb-2 text-xl font-semibold text-[#494F57]">
          Verifying your payment...
        </h2>
        <p className="text-center text-[#97999D]">
          Please wait while we confirm your payment status.
        </p>
      </div>
    );
  }

  if (error || !verifyResult) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="mb-6 rounded-full bg-[#FFF8F8] p-6">
          <XCircle className="h-16 w-16 text-[#FF1603]" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-[#494F57]">
          Verification Failed
        </h2>
        <p className="mb-6 max-w-md text-center text-[#97999D]">
          We couldn&apos;t verify your payment status. This might be a temporary
          issue. If you were charged, your booking is still being confirmed.
        </p>
        <div className="flex gap-3">
          <Link href={isLoggedIn ? `/quotes/${quoteId}` : "/login"}>
            <CustomButton
              normalColor="#FFFFFF"
              textColor="#494F57"
              style={{ border: "1px solid #EAEAEA" }}
            >
              {isLoggedIn ? "Back to Quote" : "Go to Login"}
            </CustomButton>
          </Link>
          <Link href={isLoggedIn ? "/dashboard" : "/login?callbackUrl=/dashboard"}>
            <CustomButton>View Dashboard</CustomButton>
          </Link>
        </div>
      </div>
    );
  }

  if (verifyResult.status === "paid") {
    const isDeposit = paymentType === "deposit";
    const isBalance = paymentType === "balance";
    const dashboardHref = isLoggedIn
      ? "/orders"
      : "/login?callbackUrl=/orders";

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={`mb-6 rounded-full p-6 ${isBalance ? "bg-[#ECFDF5]" : "bg-[#EFF6FF]"}`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <CheckCircle2
              className={`h-16 w-16 ${isBalance ? "text-[#10B981]" : "text-[#3B82F6]"}`}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h2 className="mb-2 text-2xl font-semibold text-[#494F57]">
            {isDeposit
              ? "Booking Confirmed!"
              : isBalance
                ? "Payment Complete!"
                : "Payment Successful!"}
          </h2>
          <p className="mb-2 max-w-md text-center text-[#97999D]">
            {isDeposit
              ? "Your deposit has been received and your booking is confirmed. We'll be in touch to schedule your work."
              : isBalance
                ? "Thank you for your final payment. Your order is now complete!"
                : "Thank you for your payment. Your order has been created and we'll begin work shortly."}
          </p>
          {isLoggedIn ? (
            <p className="mb-6 text-sm text-[#B5B7BA]">
              Redirecting to orders in {redirectCountdown} seconds...
            </p>
          ) : (
            <p className="mb-6 text-sm text-[#B5B7BA]">
              Sign in to view your order and dashboard.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3"
        >
          <Link href={dashboardHref}>
            <CustomButton>
              {isLoggedIn ? "View Orders" : "Go to Dashboard"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </CustomButton>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mb-6 rounded-full bg-[#FFF8F3] p-6">
        <XCircle className="h-16 w-16 text-[#813500]" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-[#494F57]">
        Payment Incomplete
      </h2>
      <p className="mb-6 max-w-md text-center text-[#97999D]">
        Your payment was not completed. You can try again or contact support if
        you need assistance.
      </p>
      <div className="flex gap-3">
        <Link href={isLoggedIn ? `/quotes/${quoteId}` : "/login"}>
          <CustomButton>Try Again</CustomButton>
        </Link>
      </div>
    </div>
  );
}
