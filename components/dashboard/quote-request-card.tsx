import React from "react";
import { cn } from "@/lib/utils";
import { getRequestStatusConfig } from "@/types/request";
import type { QuoteRequestPayload } from "@/types/websocket";
import { Car, MapPin, User, FileText } from "lucide-react";
import Link from "next/link";

interface QuoteRequestCardProps extends React.HTMLAttributes<HTMLDivElement> {
  quoteRequest: QuoteRequestPayload;
  time?: string;
  showTime?: boolean;
  isGrouped?: boolean;
  onViewDetails?: (requestId: string) => void;
}

const QuoteRequestCard: React.FC<QuoteRequestCardProps> = ({
  quoteRequest,
  time,
  showTime = true,
  isGrouped = false,
  onViewDetails,
  className,
  ...props
}) => {
  const statusConfig = getRequestStatusConfig(quoteRequest.status);

  return (
    <div className="flex justify-end">
      <div className={cn("flex flex-col text-[0.9rem]", showTime ? "gap-1" : "gap-0")}>
        <div
          className={cn(
            "p-5 rounded-2xl w-[320px] md:w-[380px] bg-[#FD6900] text-white font-sans",
            className
          )}
          {...props}
        >
          <div className="flex flex-col gap-4">
            {/* Header with icon and status badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div className="text-base font-semibold">
                  Quote Request
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
                {statusConfig.label}
              </span>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-white/80" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-white/80">Name</span>
                  <span className="text-sm font-medium">{quoteRequest.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Car className="w-4 h-4 text-white/80" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-white/80">Vehicle Registration</span>
                  <span className="text-sm font-semibold tracking-wide">{quoteRequest.vrm}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white/80" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-white/80">Postcode</span>
                  <span className="text-sm font-medium">{quoteRequest.postcode}</span>
                </div>
              </div>

              {quoteRequest.notes && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-white/80" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-white/80">Notes</span>
                    <span className="text-sm text-white/90">{quoteRequest.notes}</span>
                  </div>
                </div>
              )}
            </div>

            {/* View Details Button */}
            {onViewDetails ? (
              <button
                onClick={() => onViewDetails(quoteRequest.requestId)}
                className="mt-2 flex items-center justify-center w-full py-2.5 bg-white hover:bg-white/90 text-[#FD6900] text-sm font-medium rounded-xl transition-colors"
              >
                View Details
              </button>
            ) : (
              <Link
                href={`/requests/details/${quoteRequest.requestId}`}
                className="mt-2 flex items-center justify-center w-full py-2.5 bg-white hover:bg-white/90 text-[#FD6900] text-sm font-medium rounded-xl transition-colors"
              >
                View Details
              </Link>
            )}
          </div>
        </div>
        {showTime && time && (
          <div className="px-2 text-[#9CA3AF] text-xs w-full flex justify-end">
            <div>{time}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteRequestCard;
