"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useVerifyCheckout } from "@/hooks/use-payments";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import CustomButton from "@/components/custombutton";
import Link from "next/link";
import { motion } from "motion/react";

export default function PaymentSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const setHeader = useDashboardStore((state) => state.setHeader);

  const quoteId = params.id as string;
  const sessionId = searchParams.get("session_id");
  const paymentTypeParam = searchParams.get("type") as "deposit" | "balance" | null;

  const { data: verifyResult, isLoading, error } = useVerifyCheckout(sessionId || undefined);
  const paymentType = verifyResult?.paymentType || paymentTypeParam || "full";
  const [redirectCountdown, setRedirectCountdown] = useState(10);

  useEffect(() => {
    setHeader({
      title: "Payment Status",
      description: "",
      showBreadcrumbs: true,
      showButton: false,
    });
  }, [setHeader]);

  // Invalidate queries on successful payment
  useEffect(() => {
    if (verifyResult?.status === "paid") {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.detail(quoteId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    }
  }, [verifyResult, queryClient, quoteId]);

  // Auto-redirect countdown (never navigate inside a setState updater)
  useEffect(() => {
    if (verifyResult?.status !== "paid") return;

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
  }, [verifyResult?.status]);

  useEffect(() => {
    if (verifyResult?.status !== "paid" || redirectCountdown > 0) return;
    router.push("/orders");
  }, [verifyResult?.status, redirectCountdown, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Loader2 className="h-16 w-16 text-[#B3EC3D] animate-spin mb-6" />
        <h2 className="text-xl font-semibold text-[#494F57] mb-2">
          Verifying your payment...
        </h2>
        <p className="text-[#97999D] text-center">
          Please wait while we confirm your payment status.
        </p>
      </div>
    );
  }

  if (error || !verifyResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-[#FFF8F8] rounded-full p-6 mb-6">
          <XCircle className="h-16 w-16 text-[#FF1603]" />
        </div>
        <h2 className="text-xl font-semibold text-[#494F57] mb-2">
          Verification Failed
        </h2>
        <p className="text-[#97999D] text-center mb-6 max-w-md">
          We couldn&apos;t verify your payment status. This might be a temporary issue.
        </p>
        <div className="flex gap-3">
          <Link href={`/quotes/${quoteId}`}>
            <CustomButton
              normalColor="#FFFFFF"
              textColor="#494F57"
              style={{ border: "1px solid #EAEAEA" }}
            >
              Back to Quote
            </CustomButton>
          </Link>
          <Link href="/payments">
            <CustomButton>View Payments</CustomButton>
          </Link>
        </div>
      </div>
    );
  }

  if (verifyResult.status === "paid") {
    const isDeposit = paymentType === "deposit";
    const isBalance = paymentType === "balance";

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={`rounded-full p-6 mb-6 ${isBalance ? "bg-[#ECFDF5]" : "bg-[#EFF6FF]"}`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <CheckCircle2 className={`h-16 w-16 ${isBalance ? "text-[#10B981]" : "text-[#3B82F6]"}`} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold text-[#494F57] mb-2">
            {isDeposit
              ? "Booking Confirmed!"
              : isBalance
              ? "Payment Complete!"
              : "Payment Successful!"}
          </h2>
          <p className="text-[#97999D] text-center mb-2 max-w-md">
            {isDeposit
              ? "Your deposit has been received and your booking is confirmed. We'll be in touch to schedule your work."
              : isBalance
              ? "Thank you for your final payment. Your order is now complete!"
              : "Thank you for your payment. Your order has been created and we'll begin work shortly."}
          </p>
          <p className="text-sm text-[#B5B7BA] mb-6">
            Redirecting to orders in {redirectCountdown} seconds...
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3"
        >
          <Link href="/orders">
            <CustomButton>
              View Orders
              <ArrowRight className="h-4 w-4 ml-2" />
            </CustomButton>
          </Link>
          <Link href="/payments">
            <CustomButton
              normalColor="#FFFFFF"
              textColor="#494F57"
              style={{ border: "1px solid #EAEAEA" }}
            >
              View Payments
            </CustomButton>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Payment not completed (unpaid or open)
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-[#FFF8F3] rounded-full p-6 mb-6">
        <XCircle className="h-16 w-16 text-[#813500]" />
      </div>
      <h2 className="text-xl font-semibold text-[#494F57] mb-2">
        Payment Incomplete
      </h2>
      <p className="text-[#97999D] text-center mb-6 max-w-md">
        Your payment was not completed. You can try again or contact support if
        you need assistance.
      </p>
      <div className="flex gap-3">
        <Link href={`/quotes/${quoteId}`}>
          <CustomButton>Try Again</CustomButton>
        </Link>
        <Link href="/quotes">
          <CustomButton
            normalColor="#FFFFFF"
            textColor="#494F57"
            style={{ border: "1px solid #EAEAEA" }}
          >
            View Quotes
          </CustomButton>
        </Link>
      </div>
    </div>
  );
}
