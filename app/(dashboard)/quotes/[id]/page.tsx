"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, AlertTriangle, XCircle } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useQuote } from "@/hooks/use-quotes";
import { InvoicePreview } from "@/components/quote/invoice-preview";
import { QuoteActions } from "@/components/quote/quote-actions";
import { quoteStatusConfig } from "@/types/quote";

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quoteId = params.id as string;
  const setHeader = useDashboardStore((state) => state.setHeader);

  const { data: quote, isLoading, refetch } = useQuote(quoteId);

  useEffect(() => {
    setHeader({
      title: "",
      description: "",
      showBreadcrumbs: false,
      showButton: false,
    });
  }, [setHeader]);

  // Calculate validity/expiry info
  const validityInfo = useMemo(() => {
    if (!quote?.validUntil) return null;

    const now = new Date();
    const validUntil = new Date(quote.validUntil);
    const diffTime = validUntil.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: "Expired", urgent: true, icon: XCircle };
    } else if (diffDays === 0) {
      return { text: "Expires today", urgent: true, icon: AlertTriangle };
    } else if (diffDays === 1) {
      return { text: "Expires tomorrow", urgent: true, icon: AlertTriangle };
    } else if (diffDays <= 3) {
      return { text: `Expires in ${diffDays} days`, urgent: true, icon: Clock };
    } else if (diffDays <= 7) {
      return { text: `Expires in ${diffDays} days`, urgent: false, icon: Clock };
    } else {
      return {
        text: `Valid until ${validUntil.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`,
        urgent: false,
        icon: Clock
      };
    }
  }, [quote?.validUntil]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-[#F8F8F8] border-t border-[#EBEBEB] overflow-hidden">
        {/* Header skeleton */}
        <div className="flex-shrink-0 flex items-center px-3 md:px-5 py-4">
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="flex-shrink-0 h-px bg-[#EAEAEA]" />
        {/* Content skeleton */}
        <div className="flex-1 flex min-h-0 p-4 gap-4">
          <div className="flex-[3] bg-gray-100 animate-pulse rounded-2xl" />
          <div className="flex-[1] bg-gray-100 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#7F7F7F]">
        <p>Quote not found</p>
        <button
          onClick={() => router.push("/quotes")}
          className="mt-4 text-[#FD6900] hover:underline"
        >
          Back to Quotes
        </button>
      </div>
    );
  }

  const statusConfig = quoteStatusConfig[quote.status];

  return (
    <div className="h-full flex flex-col bg-[#F8F8F8] border-t border-[#EBEBEB] overflow-hidden">
      {/* Back button */}
      <div className="flex-shrink-0 px-3 md:px-5 py-3 bg-white">
        <button
          onClick={() => router.push("/quotes")}
          className="flex items-center gap-2 text-[#7F7F7F] hover:text-[#1F2937] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Quotes</span>
        </button>
      </div>

      {/* Divider */}
      <div className="flex-shrink-0 h-px bg-[#EAEAEA]" />

      {/* Header content */}
      <div className="flex-shrink-0 px-3 md:px-5 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left - Quote info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base md:text-lg font-semibold text-[#1F2937]">
                {quote.invoiceNumber || "Quote"}
              </h1>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  color: statusConfig.textColor,
                  backgroundColor: statusConfig.bgColor,
                  border: `1px solid ${statusConfig.borderColor}`,
                }}
              >
                {statusConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {quote.title && (
                <p className="text-sm text-[#7F7F7F] font-medium truncate">{quote.title}</p>
              )}
              {quote.title && validityInfo && (
                <span className="text-[#7F7F7F]">·</span>
              )}
              {validityInfo && (
                <div className={`flex items-center gap-1 text-sm font-medium flex-shrink-0 ${
                  validityInfo.urgent ? "text-[#DC2626]" : "text-[#7F7F7F]"
                }`}>
                  <validityInfo.icon className="w-3.5 h-3.5" />
                  <span>{validityInfo.text}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right - Total amount */}
          <div className="text-right flex-shrink-0">
            <p className="text-lg md:text-xl font-bold text-[#1F2937]">
              £{parseFloat(quote.total).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-[#7F7F7F] font-medium">
              inc. VAT £{parseFloat(quote.vatAmount).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex-shrink-0 h-px bg-[#EAEAEA]" />

      {/* Content Area - Split Layout */}
      <div className="flex-1 flex min-h-0 pt-4 px-4 gap-4">
        {/* Left - Invoice Preview (scrollable) */}
        <div className="flex-[3] overflow-y-auto pb-4">
          <InvoicePreview quote={quote} />
        </div>

        {/* Right - Actions Panel */}
        <div className="flex-[1] min-w-[280px] max-w-[320px] overflow-y-auto pb-4">
          <QuoteActions quote={quote} onSuccess={() => refetch()} />
        </div>
      </div>
    </div>
  );
}
