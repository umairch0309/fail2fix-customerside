"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "motion/react";
import { Download, Check, X, AlertCircle, ArrowLeft, Loader2, CreditCard, Package, Shield, Clock } from "lucide-react";
import { domToPng } from "modern-screenshot";
import { jsPDF } from "jspdf";
import CustomButton from "@/components/custombutton";
import { Textarea } from "@/components/ui/textarea";
import { useRejectQuote } from "@/hooks/use-quotes";
import { useCreateDepositCheckout, useQuotePaymentStatus } from "@/hooks/use-payments";
import type { Quote } from "@/types/quote";

interface QuoteActionsProps {
  quote: Quote;
  onSuccess?: () => void;
}

const rejectionReasons = [
  "Price too high",
  "Found alternative",
  "No longer needed",
  "Timeline doesn't work",
  "Other",
];

// Animation variants
const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.35,
      staggerChildren: 0.1,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, x: -20, y: -10 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
};

const labelVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 28 },
  },
};

const chipContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const chipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 500, damping: 20 },
  },
  tap: { scale: 0.92 },
  selected: {
    scale: [1, 1.15, 0.97, 1.03, 1],
    transition: { duration: 0.35, times: [0, 0.3, 0.5, 0.7, 1] },
  },
};

const textareaVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 25 }, 
  },
};

const buttonContainerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 28 },
  },
};

/**
 * Quote Actions Panel (Customer)
 * Deposit Payment Model: 10% to secure booking, 90% after work completes
 */
export function QuoteActions({ quote, onSuccess }: QuoteActionsProps) {
  const router = useRouter();
  const [isRejecting, setIsRejecting] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [rejectionNote, setRejectionNote] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const rejectQuote = useRejectQuote();
  const depositCheckout = useCreateDepositCheckout();
  const { data: paymentStatus } = useQuotePaymentStatus(quote.id);

  // Calculate amounts. After deposit, remaining is total − amount already paid.
  const total = parseFloat(quote.total || "0");
  const depositAmount = paymentStatus?.depositAmount || (total * 0.1).toFixed(2);
  const isExpired = quote.validUntil && new Date(quote.validUntil) < new Date();
  const depositPaid =
    paymentStatus?.depositPaid ||
    quote.status === "deposit_paid" ||
    quote.status === "paid";
  const fullyPaid = paymentStatus?.fullyPaid || quote.status === "paid";
  const canPayDeposit = quote.status === "sent" && !paymentStatus?.depositPaid && !isExpired;
  const balanceAmount = depositPaid
    ? Math.max(0, total - parseFloat(depositAmount)).toFixed(2)
    : paymentStatus?.balanceAmount || (total * 0.9).toFixed(2);

  const handlePayDeposit = async () => {
    try {
      await depositCheckout.mutateAsync(quote.id);
      onSuccess?.();
    } catch {
      // Error handled by mutation
    }
  };

  const handleReject = async () => {
    if (!selectedReason) return;

    try {
      await rejectQuote.mutateAsync({
        quoteId: quote.id,
        input: {
          rejectionReason: selectedReason,
          rejectionNote: rejectionNote || undefined,
        },
      });
      setIsRejecting(false);
      setSelectedReason("");
      setRejectionNote("");
      onSuccess?.();
    } catch {
      // Error handled by mutation
    }
  };

  const handleCancelReject = () => {
    setIsRejecting(false);
    setSelectedReason("");
    setRejectionNote("");
  };

  const handleDownload = async () => {
    const element = document.getElementById("invoice-print-area");
    if (!element) return;

    setIsDownloading(true);

    const originalStyles = {
      borderRadius: element.style.borderRadius,
      border: element.style.border,
      minHeight: element.style.minHeight,
      height: element.style.height,
      boxShadow: element.style.boxShadow,
    };

    try {
      const a4AspectRatio = 297 / 210;
      const elementWidth = element.offsetWidth;
      const a4Height = elementWidth * a4AspectRatio;

      element.style.height = "auto";
      element.style.minHeight = "auto";
      const contentHeight = element.scrollHeight;

      const pagesNeeded = Math.ceil(contentHeight / a4Height);
      const totalHeight = pagesNeeded * a4Height;

      element.style.borderRadius = "0";
      element.style.border = "none";
      element.style.boxShadow = "none";
      element.style.height = `${totalHeight}px`;
      element.style.minHeight = `${totalHeight}px`;

      const dataUrl = await domToPng(element, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const margin = 5;
      const pdfWidth = 210 - margin * 2;
      const imgHeight = (img.height * pdfWidth) / img.width;
      const singlePageHeight = imgHeight / pagesNeeded;

      for (let page = 0; page < pagesNeeded; page++) {
        if (page > 0) pdf.addPage();

        const sourceY = (page * singlePageHeight * img.width) / pdfWidth;
        const sourceHeight = (singlePageHeight * img.width) / pdfWidth;

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = sourceHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, sourceY, img.width, sourceHeight, 0, 0, img.width, sourceHeight);
          const pageData = canvas.toDataURL("image/png");
          pdf.addImage(pageData, "PNG", margin, margin, pdfWidth, Math.min(singlePageHeight, 297 - margin * 2));
        }
      }

      const fileName = `${quote.invoiceNumber || "quote"}-${quote.customerName?.replace(/\s+/g, "-") || "customer"}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      element.style.borderRadius = originalStyles.borderRadius;
      element.style.border = originalStyles.border;
      element.style.minHeight = originalStyles.minHeight;
      element.style.height = originalStyles.height;
      element.style.boxShadow = originalStyles.boxShadow;
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-full" style={{ perspective: "1000px" }}>
      <motion.div
        className="h-full relative"
        animate={{ rotateY: isRejecting ? 180 : 0 }}
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 12,
          mass: 0.9,
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* ===== FRONT FACE ===== */}
        <div
          className="bg-white rounded-2xl border border-[#E0E0E0] p-5 h-full flex flex-col absolute inset-0"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Payment Breakdown */}
          <div className="space-y-2.5 mb-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#7F7F7F] font-medium">Total Quote</span>
              <span className="text-[#1F2937] font-semibold">
                £{total.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Deposit/Balance Breakdown */}
            <div className="bg-[#F9FAFB] rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B7280] font-medium flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#F15D1E]" />
                  Deposit (10%)
                </span>
                <span className={`font-semibold ${depositPaid ? "text-emerald-600" : "text-[#F15D1E]"}`}>
                  £{parseFloat(depositAmount).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                  {depositPaid && <Check className="w-3.5 h-3.5 inline ml-1" />}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B7280] font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  Balance (90%)
                </span>
                <span className="text-[#6B7280] font-medium">
                  £{parseFloat(balanceAmount).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-xs text-[#9CA3AF] pt-1 border-t border-[#E5E7EB]">
                Balance due after work completes
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-[#7F7F7F] font-medium">Items</span>
              <span className="text-[#1F2937] font-medium">{quote.items?.length || 0}</span>
            </div>
            {quote.notes && (
              <div className="pt-2.5 border-t border-[#EAEAEA]">
                <span className="text-[#7F7F7F] font-medium text-sm">Notes</span>
                <p className="text-sm text-[#1F2937] mt-1">{quote.notes}</p>
              </div>
            )}
          </div>

          <div className="flex-1" />

          {/* Expired Warning */}
          {isExpired && quote.status === "sent" && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                This quote has expired. Please contact us for an updated quote.
              </p>
            </div>
          )}

          {/* Rejection Info */}
          {quote.status === "rejected" && quote.rejectionReason && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-xs font-semibold text-red-700 uppercase mb-1">
                Rejection Reason
              </div>
              <p className="text-sm text-red-700">{quote.rejectionReason}</p>
              {quote.rejectionNote && (
                <p className="text-xs text-red-600 mt-1">{quote.rejectionNote}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <CustomButton
              fullWidth
              onClick={handleDownload}
              disabled={isDownloading}
              normalColor="white"
              textColor="#494F57"
              style={{ border: "1px solid #D1D5DB" }}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </CustomButton>

            {/* Pay Deposit */}
            {canPayDeposit && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border border-orange-200 p-4"
              >
                <div className="text-center mb-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#F15D1E] to-orange-500 mb-2">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#1F2937]">Secure Your Booking</h4>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Pay 10% deposit to confirm your slot
                  </p>
                </div>

                <div className="flex gap-2">
                  <CustomButton
                    fullWidth
                    onClick={() => setIsRejecting(true)}
                    disabled={rejectQuote.isPending}
                    normalColor="white"
                    hoverColor="#FEE2E2"
                    textColor="#6B7280"
                    hoverTextColor="#B91C1C"
                    style={{ border: "1px solid #E5E7EB" }}
                    hoverStyle={{ border: "1px solid transparent" }}
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </CustomButton>

                  <CustomButton
                    fullWidth
                    onClick={handlePayDeposit}
                    disabled={depositCheckout.isPending}
                    loading={depositCheckout.isPending}
                    loadingText="..."
                    normalColor="#F15D1E"
                    textColor="white"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay £{parseFloat(depositAmount).toFixed(2)}
                  </CustomButton>
                </div>
              </motion.div>
            )}

            {/* Deposit Paid - Awaiting Work Completion */}
            {depositPaid && !fullyPaid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-xl bg-gradient-to-br from-blue-50/60 via-indigo-50/50 to-violet-50/40 border border-blue-100 p-4"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mb-3 shadow-lg shadow-blue-200"
                  >
                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                  </motion.div>

                  <motion.h4
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-base font-semibold text-blue-800"
                  >
                    Booking Secured!
                  </motion.h4>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-blue-600 mt-1"
                  >
                    Deposit of £{parseFloat(depositAmount).toFixed(2)} received
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="text-xs text-blue-600/70 mt-1"
                  >
                    Balance of £{parseFloat(balanceAmount).toFixed(2)} due after work completes
                  </motion.p>

                  {quote.orderId && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-4 w-full"
                    >
                      <CustomButton
                        fullWidth
                        onClick={() => router.push(`/orders/${quote.orderId}`)}
                        normalColor="#2563EB"
                        textColor="white"
                      >
                        <Package className="w-4 h-4" />
                        View Order
                      </CustomButton>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Fully Paid - Complete */}
            {fullyPaid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-xl bg-gradient-to-br from-emerald-50/60 via-green-50/50 to-teal-50/40 border border-emerald-100 p-4"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mb-3 shadow-lg shadow-emerald-200"
                  >
                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                  </motion.div>

                  <motion.h4
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-base font-semibold text-emerald-800"
                  >
                    Fully Paid!
                  </motion.h4>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-emerald-600 mt-1"
                  >
                    Total of £{total.toLocaleString("en-GB", { minimumFractionDigits: 2 })} paid
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="text-xs text-emerald-600/70 mt-1"
                  >
                    Thank you for your business!
                  </motion.p>

                  {quote.orderId && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-4 w-full"
                    >
                      <CustomButton
                        fullWidth
                        onClick={() => router.push(`/orders/${quote.orderId}`)}
                        normalColor="#059669"
                        textColor="white"
                      >
                        <Package className="w-4 h-4" />
                        View Order
                      </CustomButton>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ===== BACK FACE - Reject Form ===== */}
        <div
          className="bg-white rounded-2xl border border-[#E0E0E0] p-5 h-full flex flex-col absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <motion.div
            className="flex flex-col h-full"
            variants={contentVariants}
            initial="hidden"
            animate={isRejecting ? "visible" : "hidden"}
          >
            <motion.div variants={headerVariants} className="flex items-center gap-2 mb-4">
              <motion.button
                onClick={handleCancelReject}
                className="p-1 rounded-md text-[#7F7F7F] hover:text-[#1F2937] hover:bg-[#F5F5F5] transition-colors"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.button>
              <div>
                <h3 className="text-sm font-semibold text-[#1F2937]">Decline Quote</h3>
                <p className="text-xs text-[#7F7F7F]">Let us know why</p>
              </div>
            </motion.div>

            <motion.div variants={labelVariants} className="mb-4">
              <label className="text-xs font-medium text-[#7F7F7F] uppercase tracking-wider mb-2 block">
                Reason <span className="text-red-500">*</span>
              </label>
              <motion.div className="flex flex-wrap gap-2" variants={chipContainerVariants}>
                {rejectionReasons.map((reason) => (
                  <motion.button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    variants={chipVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap="tap"
                    animate={selectedReason === reason ? "selected" : undefined}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      selectedReason === reason
                        ? "bg-[#DC2626] text-white border-[#DC2626]"
                        : "bg-white text-[#494F57] border-[#D1D5DB] hover:border-[#DC2626]"
                    }`}
                  >
                    {reason}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={textareaVariants} className="mb-4 flex-1">
              <label className="text-xs font-medium text-[#7F7F7F] uppercase tracking-wider mb-2 block">
                Additional Notes <span className="text-[#9CA3AF]">(optional)</span>
              </label>
              <Textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="Any additional feedback..."
                className="resize-none h-24 text-sm border-[#EAEAEA]"
              />
            </motion.div>

            <motion.div className="flex gap-3 mt-auto" variants={buttonContainerVariants}>
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <CustomButton
                  fullWidth
                  onClick={handleCancelReject}
                  normalColor="white"
                  textColor="#494F57"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  Cancel
                </CustomButton>
              </motion.div>
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <CustomButton
                  fullWidth
                  onClick={handleReject}
                  disabled={!selectedReason || rejectQuote.isPending}
                  loading={rejectQuote.isPending}
                  loadingText="..."
                  normalColor="#DC2626"
                  textColor="white"
                >
                  Confirm
                </CustomButton>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
