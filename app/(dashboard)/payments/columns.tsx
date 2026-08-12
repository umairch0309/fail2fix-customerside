"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Payment,
  paymentStatusConfig,
  paymentMethodLabels,
} from "@/types/payment";
import { format } from "date-fns";
import Link from "next/link";

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "transactionId",
    header: () => <span className="pl-2">Transaction ID</span>,
    cell: ({ row }) => {
      const txId = row.original.transactionId || row.original.id.slice(0, 12);
      return (
        <span className="pl-2 text-[#494F57] font-medium">#{txId}</span>
      );
    },
  },
  {
    accessorKey: "quoteId",
    header: "Quote",
    cell: ({ row }) => (
      <Link
        href={`/quotes/${row.original.quoteId}`}
        className="text-[#97999D] hover:text-[#494F57] hover:underline"
      >
        #{row.original.quoteId.slice(0, 8)}
      </Link>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-[#97999D]">
        {format(new Date(row.original.createdAt), "MMM d, yyyy")}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.original.amount);
      return (
        <span className="text-[#494F57] font-medium">
          £ {amount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
        </span>
      );
    },
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => {
      const method = row.original.method;
      return (
        <span className="text-[#97999D]">{paymentMethodLabels[method]}</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const config = paymentStatusConfig[status];
      return (
        <div
          className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium border"
          style={{
            backgroundColor: config.bgColor,
            color: config.textColor,
            borderColor: config.borderColor,
          }}
        >
          {config.label}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center w-full">Action</div>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <Link href={`/quotes/${row.original.quoteId}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-[#494F57] border-[#EAEAEA] shadow-none"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </Link>
        </div>
      );
    },
  },
];
