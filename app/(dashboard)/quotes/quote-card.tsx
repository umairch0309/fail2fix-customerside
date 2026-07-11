"use client";

import { MoreHorizontal, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { QuoteListItem, QuoteStatus } from "@/types/quote";
import { quoteStatusConfig } from "@/types/quote";

/**
 * Format date for display
 */
function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format amount for display
 */
function formatAmount(amount: string | null): string {
  if (!amount) return "£0.00";
  const num = parseFloat(amount);
  return `£ ${num.toLocaleString("en-GB", {
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
  const displayDate = quote.sentAt
    ? formatDate(quote.sentAt)
    : formatDate(quote.createdAt);

  return (
    <div
      className="relative w-[200px] h-[280px] cursor-pointer"
      onClick={onClick}
    >
      {/* Main card */}
      <div className="absolute inset-0 bg-white border border-[#EAEAEA] p-4 flex flex-col rounded-xl hover:border-[#D0D0D0] transition-colors"></div>
      {/* White cover for top-right border - outside card to cover border */}
      <div className="absolute -top-[1px] -right-[1px] w-[36px] h-[36px] bg-white z-10" />
      {/* Folded corner effect - inward fold */}
      <div
        className="absolute top-0 right-0 z-20"
        style={{
          borderStyle: "solid",
          borderWidth: "0 32px 32px 0",
          borderColor: "#E8E8E8 white",
          borderBottomLeftRadius: "6px",
        }}
      />
      {/* Card content */}
      <div className="absolute inset-0 p-4 pb-3 flex flex-col z-30 pointer-events-none">
        <div className="pointer-events-auto flex flex-col h-full">
          {/* Invoice number */}
          <p className="text-xs text-[#81868C] mb-3">
            #{quote.invoiceNumber || "-"}
          </p>

          {/* Title */}
          <p className="text-sm font-medium text-[#494F57] truncate">
            {quote.title || "Quote"}
          </p>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Date and Amount */}
          <div>
            <p className="text-xs text-[#81868C] mb-1">{displayDate}</p>
            <p className="text-2xl font-semibold text-[#494F57] mb-4">
              {formatAmount(quote.total)}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border"
                style={{
                  backgroundColor: config.bgColor,
                  color: config.textColor,
                  borderColor: config.borderColor,
                }}
              >
                {config.label}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-[#97999D] hover:text-[#494F57] border-[#EAEAEA] shadow-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/quotes/${quote.id}`);
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Invoice
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
