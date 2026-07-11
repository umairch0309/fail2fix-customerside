"use client";

import { Calendar, AlertTriangle } from "lucide-react";
import type { OrderListItem } from "@/types/order";
import { orderStatusConfig } from "@/types/order";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface OrderCardProps {
  order: OrderListItem;
}

export function OrderCard({ order }: OrderCardProps) {
  const config = orderStatusConfig[order.status];
  const total = parseFloat(order.quoteTotal);

  return (
    <Link href={`/orders/${order.id}`}>
      <div className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden hover:border-[#D1D5DB] transition-colors cursor-pointer">
        {/* Top section */}
        <div className="p-4 pb-3.5">
          {/* Title and Status */}
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-lg font-semibold text-[#494F57]">
              {order.quoteTitle || "Untitled Order"}
            </h3>
            <div
              className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border"
              style={{
                backgroundColor: config.bgColor,
                color: config.textColor,
                borderColor: config.borderColor,
              }}
            >
              {config.label}
            </div>
          </div>

          {/* Date, Order Number, Amount */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-[#81868C] font-medium">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(order.createdAt), "dd/MM/yyyy")}</span>
            </div>
            <span className="text-[#81868C] font-medium">
              #{order.orderNumber}
            </span>
            <span className="text-[#494F57] font-medium">
              £ {total.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#EAEAEA]" />

        {/* Bottom section */}
        <div className="px-4 py-2.5 flex items-center justify-between bg-[#FAFAFA]">
          {/* Updated info */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#81868C]">
              Updated{" "}
              {formatDistanceToNow(new Date(order.updatedAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Notes warning if exists */}
          {order.notes && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#FFE4D2] bg-[#FFF8F3]">
              <AlertTriangle className="h-4 w-4 text-[#813500]" />
              <span className="text-sm text-[#813500] truncate max-w-[200px]">
                {order.notes}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
