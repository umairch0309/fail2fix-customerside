"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRequest } from "@/hooks/use-requests";
import { getRequestStatusConfig } from "@/types/request";
import { Copy, Check, Car } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { FilePreviewModal, FileThumbnail } from "@/components/ui/file-preview-modal";

interface QuoteDetailsSheetProps {
  requestId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuoteDetailsSheet: React.FC<QuoteDetailsSheetProps> = ({
  requestId,
  open,
  onOpenChange,
}) => {
  const { data: request, isLoading } = useRequest(requestId || undefined);

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleCopy = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const CopyButton = ({ value, field }: { value: string; field: string }) => (
    <button
      onClick={() => handleCopy(value, field)}
      className="p-1.5 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
    >
      {copiedField === field ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-[#9CA3AF]" />
      )}
    </button>
  );

  const handlePreview = (url: string) => {
    setPreviewUrl(url);
    setPreviewOpen(true);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 overflow-y-auto bg-[#F5F6F7]">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-[#EDEDED] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF4ED] flex items-center justify-center">
              <Car className="w-5 h-5 text-[#FD6900]" />
            </div>
            <div>
              <SheetTitle className="text-lg font-semibold text-[#1F2937]">
                Quote Details
              </SheetTitle>
              {request && (
                <p className="text-sm text-[#7F7F7F]">
                  {new Date(request.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        </SheetHeader>

        {isLoading ? (
          <div className="p-6 flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FD6900]" />
          </div>
        ) : request ? (
          <div className="px-6 pt-4 pb-6 space-y-5">
            {/* Status Badge - Prominent at top */}
            {/* Status Badge - Prominent at top */}
            <div className="flex items-center justify-between bg-white border border-[#EDEDED] rounded-lg px-4 h-14">
              <span className="text-sm font-medium text-[#7F7F7F]">Status</span>
              {(() => {
                const statusConfig = getRequestStatusConfig(request.status);
                return (
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      color: statusConfig.textColor,
                      backgroundColor: statusConfig.bgColor,
                      border: `1px solid ${statusConfig.borderColor}`,
                    }}
                  >
                    {statusConfig.label}
                  </span>
                );
              })()}
            </div>

            {/* MOT Details Upload - Moved to top */}
            {request.motDetailsUrl && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-[#7F7F7F] uppercase tracking-wider">
                  MOT Failure Details
                </h3>
                <div className="bg-white border border-[#EDEDED] rounded-xl p-4">
                  <div className="flex flex-wrap gap-3">
                    <FileThumbnail
                      url={request.motDetailsUrl}
                      onClick={() => handlePreview(request.motDetailsUrl!)}
                    />
                  </div>
                  <p className="text-xs text-[#9CA3AF] mt-3">
                    Click to preview or download
                  </p>
                </div>
              </div>
            )}

            {/* Contact Information Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#7F7F7F] uppercase tracking-wider">
                Contact Information
              </h3>
              <div className="bg-white border border-[#EDEDED] rounded-lg divide-y divide-[#EDEDED]">
                {/* Name */}
                <div className="flex items-center justify-between px-4 h-12">
                  <span className="text-sm text-[#7F7F7F]">Name</span>
                  <span className="text-sm font-medium text-[#1F2937]">
                    {request.name}
                  </span>
                </div>
                {/* Email */}
                <div className="flex items-center justify-between px-4 h-12">
                  <span className="text-sm text-[#7F7F7F]">Email</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#1F2937]">
                      {request.email}
                    </span>
                    <CopyButton value={request.email} field="email" />
                  </div>
                </div>
                {/* Phone */}
                <div className="flex items-center justify-between px-4 h-12">
                  <span className="text-sm text-[#7F7F7F]">Phone</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#1F2937]">
                      {request.phone}
                    </span>
                    <CopyButton value={request.phone} field="phone" />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Information Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#7F7F7F] uppercase tracking-wider">
                Vehicle Information
              </h3>
              <div className="bg-white border border-[#EDEDED] rounded-lg divide-y divide-[#EDEDED]">
                {/* VRM */}
                <div className="flex items-center justify-between px-4 h-12">
                  <span className="text-sm text-[#7F7F7F]">VRM</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#1F2937]">
                      {request.vrm}
                    </span>
                    <CopyButton value={request.vrm} field="vrm" />
                  </div>
                </div>
                {/* Postcode */}
                <div className="flex items-center justify-between px-4 h-12">
                  <span className="text-sm text-[#7F7F7F]">Postcode</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#1F2937]">
                      {request.postcode}
                    </span>
                    <CopyButton value={request.postcode} field="postcode" />
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#7F7F7F] uppercase tracking-wider">
                Additional Notes
              </h3>
              <div className="bg-white border border-[#EDEDED] rounded-lg px-4 py-3 min-h-[80px]">
                <p className="text-sm text-[#1F2937]">
                  {request.notes || (
                    <span className="text-[#9CA3AF] italic">No notes provided</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-[#7F7F7F] min-h-[200px] flex items-center justify-center">
            Request not found
          </div>
        )}

        {/* File Preview Modal */}
        <FilePreviewModal
          url={previewUrl}
          open={previewOpen}
          onOpenChange={setPreviewOpen}
        />
      </SheetContent>
    </Sheet>
  );
};

export default QuoteDetailsSheet;
