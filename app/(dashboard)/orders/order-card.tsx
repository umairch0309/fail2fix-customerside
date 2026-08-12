"use client";

import { Calendar, AlertTriangle, ChevronRight } from "lucide-react";
import type { OrderListItem, OrderStatus } from "@/types/order";
import { orderStatusConfig } from "@/types/order";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface OrderCardProps {
  order: OrderListItem;
}

const fallbackConfig = {
  label: "Unknown",
  textColor: "#6B7280",
  borderColor: "#D1D5DB",
  bgColor: "#F9FAFB",
};

export function OrderCard({ order }: OrderCardProps) {
  const config =
    orderStatusConfig[order.status as OrderStatus] ?? fallbackConfig;
  const total = parseFloat(order.quoteTotal);

  return (
    <Link href={`/orders/${order.id}`} className="block group">
      <div
        className="rounded-xl border overflow-hidden transition-all cursor-pointer hover:shadow-sm"
        style={{
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          borderLeftWidth: 4,
          borderLeftColor: config.textColor,
        }}
      >
        {/* Top section */}
        <div className="p-4 pb-3.5 bg-white/70">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-[#14213d] truncate group-hover:text-[#0E1716]">
                {order.quoteTitle || "Untitled Order"}
              </h3>
              <p className="text-xs font-mono text-[#81868C] mt-1">
                #{order.orderNumber}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border"
                style={{
                  backgroundColor: config.bgColor,
                  color: config.textColor,
                  borderColor: config.borderColor,
                }}
              >
                {config.label}
              </div>
              <ChevronRight className="h-4 w-4 text-[#C4C4C4] group-hover:text-[#FF8C32] transition-colors" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280] font-medium">
              <Calendar className="h-3.5 w-3.5 text-[#9CA3AF]" />
              <span>{format(new Date(order.createdAt), "dd MMM yyyy")}</span>
            </div>
            <span className="text-lg font-semibold text-[#14213d] tracking-tight">
              £
              {total.toLocaleString("en-GB", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Bottom section */}
        <div
          className="px-4 py-2.5 flex items-center justify-between border-t"
          style={{
            backgroundColor: config.bgColor,
            borderColor: config.borderColor,
          }}
        >
          <span className="text-xs font-medium" style={{ color: config.textColor }}>
            Updated{" "}
            {formatDistanceToNow(new Date(order.updatedAt), {
              addSuffix: true,
            })}
          </span>

          {order.notes && (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-[#FFE4D2] bg-white/80">
              <AlertTriangle className="h-3.5 w-3.5 text-[#813500]" />
              <span className="text-xs text-[#813500] truncate max-w-[200px]">
                {order.notes}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
