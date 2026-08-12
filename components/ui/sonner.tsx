"use client"

import { Loader2Icon } from "lucide-react"
import { toast as sonnerToast, Toaster as Sonner, type ToasterProps, type ExternalToast } from "sonner"
import { playNotificationSound } from "@/lib/notification-sound"

// Custom icons for better design
const SuccessIcon = () => (
  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shrink-0 shadow-sm">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
)

const ErrorIcon = () => (
  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center shrink-0 shadow-sm">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 3L9 9M9 3L3 9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
)

const WarningIcon = () => (
  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shrink-0 shadow-sm">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 3V6.5M6 8.5V9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
)

const InfoIcon = () => (
  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center shrink-0 shadow-sm">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 5.5V9M6 3V3.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
)

export const MessageIcon = () => (
  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#F15D1E] to-[#E04D0E] flex items-center justify-center shrink-0 shadow-sm">
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M5.5 7H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4.5 12H7.5L10.5 14.2C10.94 14.5 11.5 14.18 11.5 13.64V12C13.5 12 15 10.5 15 8.5V4.5C15 2.5 13.5 1 11.5 1H4.5C2.5 1 1 2.5 1 4.5V8.5C1 10.5 2.5 12 4.5 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
)

const LoadingIcon = () => (
  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#F15D1E] to-[#E04D0E] flex items-center justify-center shrink-0 shadow-sm">
    <Loader2Icon className="w-3 h-3 text-white animate-spin" />
  </div>
)

// Custom toast functions
type ToastOptions = ExternalToast & { sound?: boolean }

export const toast = {
  // Default toast
  message: (message: string, options?: ToastOptions) => {
    if (options?.sound === true) playNotificationSound("message")
    return sonnerToast(message, { ...options, icon: options?.icon ?? <MessageIcon /> })
  },

  // Success toast
  success: (message: string, options?: ToastOptions) => {
    if (options?.sound === true) playNotificationSound("success")
    return sonnerToast.success(message, options)
  },

  // Error toast
  error: (message: string, options?: ToastOptions) => {
    if (options?.sound === true) playNotificationSound("error")
    return sonnerToast.error(message, options)
  },

  // Warning toast
  warning: (message: string, options?: ToastOptions) => {
    if (options?.sound === true) playNotificationSound("warning")
    return sonnerToast.warning(message, options)
  },

  // Info toast
  info: (message: string, options?: ToastOptions) => {
    if (options?.sound === true) playNotificationSound("info")
    return sonnerToast.info(message, options)
  },

  // Loading toast
  loading: (message: string, options?: ExternalToast) => {
    return sonnerToast.loading(message, options)
  },

  // Promise toast
  promise: sonnerToast.promise,

  // Dismiss toast
  dismiss: sonnerToast.dismiss,

  // Custom toast
  custom: sonnerToast.custom,
}

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      // Keep multiple toasts fully expanded so they stack with spacing
      // instead of collapsing on top of each other (Sonner's default).
      expand
      gap={12}
      visibleToasts={5}
      icons={{
        success: <SuccessIcon />,
        info: <InfoIcon />,
        warning: <WarningIcon />,
        error: <ErrorIcon />,
        loading: <LoadingIcon />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "group toast-wrapper grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 w-full px-4 py-3.5 bg-white rounded-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)] border border-[#E5E7EB] ring-1 ring-black/[0.03] font-sans [&:has(button[data-button])]:grid-rows-[auto_auto]",
          title: "text-sm font-semibold text-[#111827] tracking-tight",
          description: "text-xs text-[#6B7280] mt-0.5 leading-relaxed",
          actionButton: "col-span-2 bg-[#F15D1E] text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-[#E04D0E] transition-all hover:shadow-md w-full justify-center",
          cancelButton: "col-span-2 bg-[#F3F4F6] text-[#4B5563] text-xs font-medium px-3 py-2 rounded-lg hover:bg-[#E5E7EB] transition-colors w-full justify-center",
          closeButton: "!bg-transparent !border-0 !shadow-none text-[#9CA3AF] hover:text-[#4B5563] !right-2 !top-2 transition-colors",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
