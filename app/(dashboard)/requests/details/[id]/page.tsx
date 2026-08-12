"use client";

import { useParams, useRouter } from "next/navigation";
import { useRequest } from "@/hooks/use-requests";
import { getRequestStatusConfig } from "@/types/request";
import { Copy, Check, Car, ArrowLeft, Wrench, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/sonner";
import { useState, useEffect } from "react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { FilePreviewModal, FileThumbnail } from "@/components/ui/file-preview-modal";

export default function RequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;
  const setHeader = useDashboardStore((state) => state.setHeader);

  const { data: request, isLoading } = useRequest(requestId);

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePreview = (url: string) => {
    setPreviewUrl(url);
    setPreviewOpen(true);
  };

  useEffect(() => {
    setHeader({
      title: "",
      description: "",
      showBreadcrumbs: false,
      showButton: false,
    });
  }, [setHeader]);

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
      className="p-1 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
    >
      {copiedField === field ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-[#9CA3AF]" />
      )}
    </button>
  );

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-[#F8F8F8] border-t border-[#EBEBEB] overflow-hidden">
        <div className="shrink-0 px-3 md:px-5 py-3 bg-white">
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="shrink-0 h-px bg-[#EAEAEA]" />
        <div className="flex-1 p-4">
          <div className="h-full bg-gray-100 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#7F7F7F]">
        <p>Request not found</p>
        <button
          onClick={() => router.push("/requests")}
          className="mt-4 text-[#FD6900] hover:underline"
        >
          Back to Requests
        </button>
      </div>
    );
  }

  const statusConfig = getRequestStatusConfig(request.status);

  return (
    <div className="h-full flex flex-col bg-[#F8F8F8] border-t border-[#EBEBEB] overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-3 md:px-5 py-3 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/requests")}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF4ED] flex items-center justify-center">
              <Car className="w-5 h-5 text-[#FD6900]" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-[#1F2937]">Request Details</h1>
              <p className="text-xs text-[#7F7F7F]">
                {new Date(request.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
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
      </div>

      {/* Divider */}
      <div className="shrink-0 h-px bg-[#EAEAEA]" />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* MOT Details Upload */}
          {request.motDetailsUrl && (
            <div className="bg-white border border-[#EDEDED] rounded-xl p-4">
              <h3 className="text-xs font-semibold text-[#7F7F7F] uppercase tracking-wider mb-3">
                MOT Failure Details
              </h3>
              <div className="flex flex-wrap gap-3">
                <FileThumbnail
                  url={request.motDetailsUrl}
                  onClick={() => handlePreview(request.motDetailsUrl!)}
                />
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-white border border-[#EDEDED] rounded-xl p-4">
            <h3 className="text-xs font-semibold text-[#7F7F7F] uppercase tracking-wider mb-3">
              Contact Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                <span className="text-sm text-[#7F7F7F]">Name</span>
                <span className="text-sm font-medium text-[#1F2937]">{request.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                <span className="text-sm text-[#7F7F7F]">Email</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-[#1F2937]">{request.email}</span>
                  <CopyButton value={request.email} field="email" />
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-[#7F7F7F]">Phone</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-[#1F2937]">{request.phone}</span>
                  <CopyButton value={request.phone} field="phone" />
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-white border border-[#EDEDED] rounded-xl p-4">
            <h3 className="text-xs font-semibold text-[#7F7F7F] uppercase tracking-wider mb-3">
              Vehicle Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                <span className="text-sm text-[#7F7F7F]">VRM</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-[#1F2937]">{request.vrm}</span>
                  <CopyButton value={request.vrm} field="vrm" />
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-[#7F7F7F]">Postcode</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-[#1F2937]">{request.postcode}</span>
                  <CopyButton value={request.postcode} field="postcode" />
                </div>
              </div>
            </div>
          </div>

          {/* Quote Available Banner */}
          {request.quote && request.status === "quote_sent" && (
            <div className="bg-gradient-to-r from-[#FFF4ED] to-[#FFF8F3] border border-[#FFE4D2] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <FileText className="w-5 h-5 text-[#FD6900]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1F2937]">Quote Ready</h3>
                    <p className="text-xs text-[#7F7F7F]">
                      Total: £{parseFloat(request.quote.total).toFixed(2)}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/quotes/${request.quote.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#FD6900] text-white text-sm font-medium rounded-lg hover:bg-[#E55F00] transition-colors"
                >
                  View Quote
                </Link>
              </div>
            </div>
          )}

          {/* Selected Repairs */}
          {request.quote && request.quote.items.length > 0 && (
            <div className="bg-white border border-[#EDEDED] rounded-xl p-4">
              <h3 className="text-xs font-semibold text-[#7F7F7F] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-[#FD6900]" />
                Selected Repairs ({request.quote.items.length})
              </h3>
              <div className="space-y-2">
                {request.quote.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-2 border-b border-[#F3F4F6] last:border-0"
                  >
                    <p className="text-sm font-medium text-[#1F2937]">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          <div className="bg-white border border-[#EDEDED] rounded-xl p-4">
            <h3 className="text-xs font-semibold text-[#7F7F7F] uppercase tracking-wider mb-3">
              Additional Notes
            </h3>
            <p className="text-sm text-[#1F2937]">
              {request.notes || <span className="text-[#9CA3AF] italic">No notes provided</span>}
            </p>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      <FilePreviewModal
        url={previewUrl}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
}
