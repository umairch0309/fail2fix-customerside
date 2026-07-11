"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Request, RequestStatus } from "@/types/request";
import { requestStatusConfig } from "@/types/request";
import Link from "next/link";

// Base columns without actions (shared between both versions)
const baseColumns: ColumnDef<Request>[] = [
  {
    accessorKey: "vrm",
    header: () => <span className="pl-2">VRM</span>,
    cell: ({ row }) => (
      <span className="pl-2 font-medium text-[#494F57]">{row.getValue("vrm")}</span>
    ),
  },
  {
    accessorKey: "postcode",
    header: "Postcode",
    cell: ({ row }) => (
      <span className="text-[#97999D]">{row.getValue("postcode")}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Requested",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return (
        <span className="text-[#97999D]">
          {date.toLocaleDateString("en-GB", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as RequestStatus;
      const config = requestStatusConfig[status];
      return (
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium border"
          style={{
            backgroundColor: config.bgColor,
            color: config.textColor,
            borderColor: config.borderColor,
          }}
        >
          <span
            className="w-2 h-2 rounded-sm"
            style={{ backgroundColor: config.statusColor }}
          />
          {config.label}
        </div>
      );
    },
  },
];

// Link-based columns for requests page (uses parallel routes)
export const columns: ColumnDef<Request>[] = [
  ...baseColumns,
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const request = row.original;
      const hasQuote = request.quote && request.status === "quote_sent";

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-[#494F57] border-[#EAEAEA]"
            asChild
          >
            <Link href={`/requests/details/${request.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>
          {hasQuote && (
            <Button
              size="sm"
              className="h-8 px-3 bg-[#FD6900] hover:bg-[#E55F00] text-white"
              asChild
            >
              <Link href={`/quotes/${request.quote!.id}`}>
                <FileText className="h-4 w-4 mr-1" />
                Quote
              </Link>
            </Button>
          )}
        </div>
      );
    },
  },
];

// Callback-based columns for dashboard/chat (opens sheet directly)
export const createColumns = (
  onViewDetails: (requestId: string) => void
): ColumnDef<Request>[] => [
  ...baseColumns,
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const request = row.original;
      const hasQuote = request.quote && request.status === "quote_sent";

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-[#494F57] border-[#EAEAEA]"
            onClick={() => onViewDetails(request.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {hasQuote && (
            <Button
              size="sm"
              className="h-8 px-3 bg-[#FD6900] hover:bg-[#E55F00] text-white"
              asChild
            >
              <Link href={`/quotes/${request.quote!.id}`}>
                <FileText className="h-4 w-4 mr-1" />
                Quote
              </Link>
            </Button>
          )}
        </div>
      );
    },
  },
];
