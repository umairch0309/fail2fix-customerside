"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import {
  X,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  Image as ImageIcon,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface FilePreviewModalProps {
  url: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName?: string;
}

export function FilePreviewModal({
  url,
  open,
  onOpenChange,
  fileName,
}: FilePreviewModalProps) {
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  // Reset state when modal opens
  React.useEffect(() => {
    if (open) {
      setZoom(1);
      setRotation(0);
      setIsLoading(true);
      setHasError(false);
    }
  }, [open, url]);

  if (!url) return null;

  const fileType = getFileType(url);
  const displayName = fileName || getFileName(url);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = displayName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const handleOpenExternal = () => {
    window.open(url, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-3xl w-[92vw] max-h-[85vh] p-0 gap-0 overflow-hidden bg-white border border-[#E5E7EB] rounded-2xl shadow-xl flex flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <VisuallyHidden>
          <DialogTitle>File Preview: {displayName}</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="px-4 py-3 bg-white border-b border-[#E5E7EB] shrink-0">
          <div className="flex items-center justify-between gap-4">
            {/* File info - left side */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center shrink-0">
                {fileType === "pdf" ? (
                  <FileText className="w-5 h-5 text-red-500" />
                ) : fileType === "image" ? (
                  <ImageIcon className="w-5 h-5 text-[#FD6900]" />
                ) : (
                  <File className="w-5 h-5 text-[#6B7280]" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1F2937] truncate max-w-[180px] sm:max-w-[300px]">
                  {displayName}
                </p>
                <p className="text-xs text-[#9CA3AF] capitalize">{fileType} file</p>
              </div>
            </div>

            {/* Controls - right side, single unified bar */}
            <TooltipProvider delayDuration={400} skipDelayDuration={100}>
              <div className="flex items-center bg-[#F5F6F7] rounded-xl p-1 gap-0.5 shrink-0">
                {/* Zoom controls - only for images */}
                {fileType === "image" && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleZoomOut}
                          className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#1F2937] hover:bg-white"
                          disabled={zoom <= 0.5}
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={8}>
                        Zoom out
                      </TooltipContent>
                    </Tooltip>
                    <span className="text-xs text-[#6B7280] w-11 text-center font-medium tabular-nums">
                      {Math.round(zoom * 100)}%
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleZoomIn}
                          className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#1F2937] hover:bg-white"
                          disabled={zoom >= 3}
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={8}>
                        Zoom in
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleRotate}
                          className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#1F2937] hover:bg-white"
                        >
                          <RotateCw className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={8}>
                        Rotate
                      </TooltipContent>
                    </Tooltip>
                    <div className="w-px h-5 bg-[#E5E7EB] mx-1" />
                  </>
                )}

                {/* Action buttons */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDownload}
                      className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#1F2937] hover:bg-white"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={8}>
                    Download file
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleOpenExternal}
                      className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#1F2937] hover:bg-white"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={8}>
                    Open in new tab
                  </TooltipContent>
                </Tooltip>
                <div className="w-px h-5 bg-[#E5E7EB] mx-1" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onOpenChange(false)}
                      className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#1F2937] hover:bg-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={8}>
                    Close preview
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-[#F9FAFB] flex items-center justify-center p-6 min-h-[300px]">
          {fileType === "image" ? (
            <div
              className={cn(
                "relative flex items-center justify-center transition-transform duration-200",
                isLoading && "animate-pulse"
              )}
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-3 border-[#E5E7EB] border-t-[#FD6900] rounded-full animate-spin" />
                </div>
              )}
              {hasError ? (
                <div className="flex flex-col items-center gap-4 text-[#6B7280] py-8">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm">
                    <ImageIcon className="w-10 h-10 text-[#D1D5DB]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#4B5563]">Failed to load image</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">The image might be unavailable</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenExternal}
                    className="text-[#1F2937] border-[#E5E7EB] hover:bg-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in new tab
                  </Button>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={displayName}
                  className={cn(
                    "max-w-full max-h-[calc(85vh-120px)] object-contain rounded-xl shadow-md",
                    isLoading && "opacity-0"
                  )}
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                  }}
                />
              )}
            </div>
          ) : fileType === "pdf" ? (
            <iframe
              src={`${url}#toolbar=0`}
              className="w-full h-full min-h-[400px] rounded-xl bg-white shadow-md"
              title={displayName}
            />
          ) : (
            <div className="flex flex-col items-center gap-5 text-[#6B7280] py-8">
              <div className="w-24 h-24 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm">
                <File className="w-12 h-12 text-[#D1D5DB]" />
              </div>
              <div className="text-center">
                <p className="text-base font-medium text-[#1F2937] mb-1">{displayName}</p>
                <p className="text-sm text-[#9CA3AF]">Preview not available for this file type</p>
              </div>
              <div className="flex gap-3 mt-2">
                <Button
                  onClick={handleDownload}
                  className="bg-[#FD6900] hover:bg-[#e55f00] text-white px-5"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={handleOpenExternal}
                  className="text-[#1F2937] border-[#E5E7EB] hover:bg-white px-5"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper functions
function getFileType(url: string): "pdf" | "image" | "unknown" {
  const lowercaseUrl = url.toLowerCase();
  if (lowercaseUrl.includes(".pdf")) return "pdf";
  if (
    lowercaseUrl.includes(".png") ||
    lowercaseUrl.includes(".jpg") ||
    lowercaseUrl.includes(".jpeg") ||
    lowercaseUrl.includes(".webp") ||
    lowercaseUrl.includes(".gif")
  )
    return "image";
  return "unknown";
}

function getFileName(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split("/").pop() || "File";
    // Decode URI component and clean up
    return decodeURIComponent(filename);
  } catch {
    return "File";
  }
}

// Export the thumbnail component for use in lists
interface FileThumbnailProps {
  url: string;
  onClick?: () => void;
  className?: string;
}

export function FileThumbnail({ url, onClick, className }: FileThumbnailProps) {
  const fileType = getFileType(url);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-[100px] h-[80px] rounded-xl overflow-hidden border-2 border-[#EDEDED] hover:border-[#FD6900] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FD6900] focus:ring-offset-2",
        className
      )}
    >
      {fileType === "image" && !hasError ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 bg-[#F5F6F7] animate-pulse" />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Preview"
            className={cn(
              "w-full h-full object-cover transition-transform duration-200 group-hover:scale-105",
              isLoading && "opacity-0"
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        </>
      ) : (
        <div className="w-full h-full bg-[#F5F6F7] flex items-center justify-center">
          {fileType === "pdf" ? (
            <FileText className="w-8 h-8 text-red-400" />
          ) : (
            <ImageIcon className="w-8 h-8 text-[#9CA3AF]" />
          )}
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <ZoomIn className="w-4 h-4 text-[#1F2937]" />
          </div>
        </div>
      </div>
    </button>
  );
}
