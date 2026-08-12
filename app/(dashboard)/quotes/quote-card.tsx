"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { QuoteListItem, QuoteStatus } from "@/types/quote";
import { quoteStatusConfig } from "@/types/quote";

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(amount: string | null): string {
  if (!amount) return "£0.00";
  const num = parseFloat(amount);
  return `£${num.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

interface QuoteCardProps {
  quote: QuoteListItem;
  onClick?: () => void;
}

export function QuoteCard({ quote, onClick }: QuoteCardProps) {
  const router = useRouter();
  const config =
    quoteStatusConfig[quote.status as QuoteStatus] || quoteStatusConfig.sent;

  const metaLabel = quote.validUntil
    ? `Valid until ${formatDate(quote.validUntil)}`
    : quote.sentAt
      ? `Sent ${formatDate(quote.sentAt)}`
      : `Created ${formatDate(quote.createdAt)}`;

  const handleView = (e: MouseEvent) => {
    e.stopPropagation();
    router.push(`/quotes/${quote.id}`);
  };

  return (
    <div
      className="relative w-full max-w-[240px] min-h-[200px] cursor-pointer"
      onClick={onClick}
    >
      {/* Main card with status accent */}
      <div
        className="absolute inset-0 bg-white border border-[#EAEAEA] rounded-xl hover:border-[#D0D0D0] transition-colors"
        style={{ borderLeftWidth: 3, borderLeftColor: config.textColor }}
      />
      {/* White cover for top-right border - outside card to cover border */}
      <div className="absolute -top-[1px] -right-[1px] w-[36px] h-[36px] bg-white z-10" />
      {/* Folded corner — tinted by status */}
      <div
        className="absolute top-0 right-0 z-20"
        style={{
          borderStyle: "solid",
          borderWidth: "0 32px 32px 0",
          borderColor: `${config.borderColor} white`,
          borderBottomLeftRadius: "6px",
        }}
      />

      {/* Card content */}
      <div className="relative z-30 flex flex-col gap-3 p-4 pr-5 pt-4 pb-3">
        {/* Invoice + status */}
        <div className="flex items-start justify-between gap-2 pr-4">
          <p className="text-xs text-[#81868C] font-mono truncate min-w-0">
            #{quote.invoiceNumber || "-"}
          </p>
          <span
            className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border"
            style={{
              backgroundColor: config.bgColor,
              color: config.textColor,
              borderColor: config.borderColor,
            }}
          >
            {config.label}
          </span>
        </div>

        {/* Title + meta */}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#494F57] truncate">
            {quote.title || "Quote"}
          </p>
          <p className="text-xs text-[#81868C] mt-1">{metaLabel}</p>
        </div>

        {/* Amount + CTA */}
        <div className="mt-auto pt-2 space-y-3">
          <p className="text-2xl font-semibold text-[#494F57] tracking-tight">
            {formatAmount(quote.total)}
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full h-9 text-sm font-medium text-[#494F57] border-[#EAEAEA] hover:bg-[#F8F8F8] hover:text-[#0E1716] shadow-none"
            onClick={handleView}
          >
            View quote
          </Button>
        </div>
      </div>
    </div>
  );
}
