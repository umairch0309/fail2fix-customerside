"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, Calendar, CreditCard, Clock, Package, Info, AlertTriangle, AlertOctagon, MessageSquare, Check, Banknote } from "lucide-react";
import { format } from "date-fns";
import { motion } from "motion/react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useOrder } from "@/hooks/use-orders";
import { useQuotePaymentStatus, useCreateBalanceCheckout } from "@/hooks/use-payments";
import { orderStatusConfig, type OrderUpdateType } from "@/types/order";
import { Skeleton } from "@/components/ui/skeleton";
import CustomButton from "@/components/custombutton";

const updateTypeConfig: Record<OrderUpdateType, { icon: typeof Info; color: string; bg: string }> = {
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-50" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  critical: { icon: AlertOctagon, color: "text-red-500", bg: "bg-red-50" },
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const setHeader = useDashboardStore((state) => state.setHeader);

  const { data: order, isLoading } = useOrder(orderId);
  const { data: paymentStatus } = useQuotePaymentStatus(order?.quoteId);
  const balanceCheckout = useCreateBalanceCheckout();

  useEffect(() => {
    setHeader({
      title: "",
      description: "",
      showBreadcrumbs: false,
      showButton: false,
    });
  }, [setHeader]);

  if (isLoading) {
    return (
      <div className="h-full bg-[#F8F8F8] border-t border-[#EBEBEB] overflow-auto">
        <div className="max-w-4xl mx-auto px-3 md:px-5 py-6">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="h-full bg-[#F8F8F8] border-t border-[#EBEBEB] flex flex-col items-center justify-center min-h-[400px] text-[#7F7F7F]">
        <p>Order not found</p>
        <button
          onClick={() => router.push("/orders")}
          className="mt-4 text-[#F15D1E] hover:underline"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const config = orderStatusConfig[order.status];
  const quoteTotal = order.quote ? parseFloat(order.quote.total) : 0;
  const itemCount = order.quote?.items?.length || 0;

  // Balance payment calculations
  const balanceAmount = paymentStatus?.balanceAmount
    ? parseFloat(paymentStatus.balanceAmount)
    : quoteTotal * 0.90;
  const canPayBalance = paymentStatus?.canPayBalance ||
    (order.status === "completed" && paymentStatus?.depositPaid && !paymentStatus?.fullyPaid);
  const isFullyPaid = paymentStatus?.fullyPaid;

  const handlePayBalance = async () => {
    if (order.quoteId) {
      await balanceCheckout.mutateAsync(order.quoteId);
    }
  };

  return (
    <div className="h-full bg-[#F8F8F8] border-t border-[#EBEBEB] overflow-auto">
      <div className="max-w-4xl mx-auto px-3 md:px-5 py-6">
        {/* Back Button & Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/orders")}
            className="flex items-center gap-2 text-[#494F57] hover:text-[#1F2937] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-semibold">{order.orderNumber}</span>
          </button>

          {/* Status Badge */}
          <span
            className="px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: config.bgColor,
              color: config.textColor,
              border: `1px solid ${config.borderColor}`,
            }}
          >
            {config.label}
          </span>
        </div>

        <div className="space-y-6">
          {/* Order Summary Card */}
          <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
            <h2 className="text-base font-semibold text-[#1F2937] mb-4">Order Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Order Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                  <p className="text-sm font-medium text-[#1F2937]">
                    {format(new Date(order.createdAt), "dd MMM yyyy")}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Total Amount</p>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#9CA3AF]" />
                  <p className="text-sm font-medium text-[#1F2937]">
                    £{quoteTotal.toFixed(2)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Total Items</p>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#9CA3AF]" />
                  <p className="text-sm font-medium text-[#1F2937]">{itemCount}</p>
                </div>
              </div>
              {order.scheduledDate && (
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Scheduled Date</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#9CA3AF]" />
                    <p className="text-sm font-medium text-[#1F2937]">
                      {format(new Date(order.scheduledDate), "dd MMM yyyy")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info Card */}
          {order.payment && (
            <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
              <h2 className="text-base font-semibold text-[#1F2937] mb-4">Payment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#9CA3AF]" />
                    <p className="text-sm font-medium text-[#1F2937] capitalize">
                      {order.payment.method.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Payment Status</p>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      order.payment.status === "completed"
                        ? "bg-green-50 text-green-700"
                        : order.payment.status === "pending"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {order.payment.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Paid On</p>
                  <p className="text-sm font-medium text-[#1F2937]">
                    {order.payment.paidAt
                      ? format(new Date(order.payment.paidAt), "dd MMM yyyy, HH:mm")
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Balance Payment Card - Show when work completed and balance pending */}
          {canPayBalance && !isFullyPaid && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-xl border border-orange-200 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-200">
                  <Banknote className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-orange-800">
                    Balance Payment Due
                  </h3>
                  <p className="text-sm text-orange-700 mt-1">
                    Work has been completed! Please pay the remaining balance to close this order.
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="text-2xl font-bold text-orange-800">
                      £{balanceAmount.toFixed(2)}
                    </div>
                    <CustomButton
                      onClick={handlePayBalance}
                      disabled={balanceCheckout.isPending}
                      normalColor="#EA580C"
                      textColor="white"
                    >
                      <CreditCard className="w-4 h-4" />
                      {balanceCheckout.isPending ? "Processing..." : "Pay Now"}
                    </CustomButton>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Fully Paid Success Card */}
          {isFullyPaid && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-xl border border-emerald-200 p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200">
                  <Check className="w-6 h-6 text-white" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-800">
                    Fully Paid
                  </h3>
                  <p className="text-sm text-emerald-700 mt-1">
                    Thank you! All payments have been received for this order.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Line Items Card */}
          <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
            <div className="p-6 border-b border-[#E0E0E0]">
              <h2 className="text-base font-semibold text-[#1F2937]">
                {order.quote?.title || "Order Items"}
              </h2>
              {order.quote?.invoiceNumber && (
                <p className="text-xs text-[#9CA3AF] mt-1">
                  Invoice: {order.quote.invoiceNumber}
                </p>
              )}
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E0E0E0]">
                    <th className="text-left text-xs font-medium text-[#6B7280] px-6 py-3">
                      Description
                    </th>
                    <th className="text-center text-xs font-medium text-[#6B7280] px-4 py-3 w-24">
                      Qty
                    </th>
                    <th className="text-right text-xs font-medium text-[#6B7280] px-4 py-3 w-32">
                      Unit Price
                    </th>
                    <th className="text-right text-xs font-medium text-[#6B7280] px-6 py-3 w-32">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.quote?.items && order.quote.items.length > 0 ? (
                    order.quote.items.map((item) => (
                      <tr key={item.id} className="border-b border-[#E0E0E0] last:border-0">
                        <td className="px-6 py-4">
                          <p className="text-sm text-[#1F2937]">{item.description}</p>
                        </td>
                        <td className="text-center px-4 py-4">
                          <p className="text-sm text-[#6B7280]">{item.quantity}</p>
                        </td>
                        <td className="text-right px-4 py-4">
                          <p className="text-sm text-[#6B7280]">
                            £{parseFloat(item.unitPrice).toFixed(2)}
                          </p>
                        </td>
                        <td className="text-right px-6 py-4">
                          <p className="text-sm font-medium text-[#1F2937]">
                            £{parseFloat(item.total).toFixed(2)}
                          </p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-[#9CA3AF]">
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            {order.quote && (
              <div className="p-6 bg-[#F9FAFB] border-t border-[#E0E0E0]">
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-8 text-sm">
                    <span className="text-[#6B7280]">Subtotal</span>
                    <span className="text-[#1F2937] w-28 text-right">
                      £{parseFloat(order.quote.subtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-8 text-sm">
                    <span className="text-[#6B7280]">VAT ({order.quote.vatRate}%)</span>
                    <span className="text-[#1F2937] w-28 text-right">
                      £{parseFloat(order.quote.vatAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-8 text-base font-semibold pt-2 border-t border-[#E5E7EB] mt-2">
                    <span className="text-[#1F2937]">Total</span>
                    <span className="text-[#1F2937] w-28 text-right">
                      £{quoteTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Updates Section */}
          <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
            <div className="p-6 border-b border-[#E0E0E0]">
              <h2 className="text-base font-semibold text-[#1F2937]">Updates</h2>
            </div>

            {order.updates && order.updates.length > 0 ? (
              <div className="px-6 py-4 space-y-3">
                {order.updates.map((update) => {
                  const typeConfig = updateTypeConfig[update.type];
                  const Icon = typeConfig.icon;
                  return (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]"
                    >
                      <div className={`w-8 h-8 rounded-full ${typeConfig.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${typeConfig.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#494F57] leading-relaxed">{update.content}</p>
                        <p className="text-xs text-[#9CA3AF] mt-1.5">
                          {format(new Date(update.createdAt), "dd MMM yyyy, HH:mm")}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5 text-[#9CA3AF]" />
                </div>
                <p className="text-sm text-[#9CA3AF]">No updates yet</p>
                <p className="text-xs text-[#D1D5DB] mt-1">Updates from the team will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
