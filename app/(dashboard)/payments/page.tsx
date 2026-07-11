"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { CreditCard, FileText, ArrowRight, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/stores/dashboard-store";
import { DataTable, DataTableToolbar } from "@/components/data-table";
import { columns } from "./columns";
import { usePayments } from "@/hooks/use-payments";
import { paymentMethodLabels } from "@/types/payment";
import { Skeleton } from "@/components/ui/skeleton";

const tabs = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

export default function PaymentsPage() {
  const router = useRouter();
  const setHeader = useDashboardStore((state) => state.setHeader);
  const [activeTab, setActiveTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  );
  const [rangeFilters, setRangeFilters] = useState<
    Record<string, [number, number]>
  >({});

  const { data: payments = [], isLoading } = usePayments();

  useEffect(() => {
    setHeader({
      title: "Payments",
      description: "View your payment history",
      showBreadcrumbs: false,
      showButton: false,
    });
  }, [setHeader]);

  // Generate dynamic filters based on data
  const dynamicFilters = useMemo(() => {
    if (!payments.length) return [];

    // Get unique payment methods from data
    const methods = [...new Set(payments.map((p) => p.method))];

    // Get min/max amounts for range filter
    const amounts = payments.map((p) => parseFloat(p.amount));
    const minAmount = Math.floor(Math.min(...amounts) / 100) * 100;
    const maxAmount = Math.ceil(Math.max(...amounts) / 100) * 100;

    return [
      {
        key: "method",
        label: "Payment Method",
        options: methods.map((method) => ({
          value: method,
          label: paymentMethodLabels[method] || method,
        })),
      },
      {
        key: "amount",
        label: "Amount Range",
        type: "range" as const,
        min: minAmount || 0,
        max: maxAmount || 10000,
        step: 50,
        formatValue: (v: number) => `£${v.toLocaleString()}`,
      },
    ];
  }, [payments]);

  // Initialize range filters with defaults
  useEffect(() => {
    const initialRangeFilters: Record<string, [number, number]> = {};
    dynamicFilters.forEach((filter) => {
      if (filter.type === "range") {
        initialRangeFilters[filter.key] = [filter.min, filter.max];
      }
    });
    setRangeFilters(initialRangeFilters);
  }, [dynamicFilters]);

  const handleFilterChange = (key: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  const handleRangeFilterChange = (key: string, values: [number, number]) => {
    setRangeFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  // Filter data based on active tab and filters
  const filteredData = useMemo(() => {
    let data = payments;

    // Tab filter
    if (activeTab !== "all") {
      data = data.filter((payment) => payment.status === activeTab);
    }

    // Method filter
    if (activeFilters.method?.length) {
      data = data.filter((payment) =>
        activeFilters.method.includes(payment.method)
      );
    }

    // Amount range filter
    const amountRange = rangeFilters.amount;
    if (amountRange) {
      data = data.filter((payment) => {
        const amount = parseFloat(payment.amount);
        return amount >= amountRange[0] && amount <= amountRange[1];
      });
    }

    return data;
  }, [activeTab, activeFilters, rangeFilters, payments]);

  // Search filter
  const searchFilteredData = useMemo(() => {
    if (!searchValue) return filteredData;
    const search = searchValue.toLowerCase();
    return filteredData.filter(
      (payment) =>
        payment.id.toLowerCase().includes(search) ||
        (payment.transactionId &&
          payment.transactionId.toLowerCase().includes(search)) ||
        payment.quoteId.toLowerCase().includes(search)
    );
  }, [filteredData, searchValue]);

  if (isLoading) {
    return (
      <div className="space-y-4 px-3 md:px-5 pb-3 md:pb-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-3 md:px-5 pb-3 md:pb-4">
      <DataTableToolbar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search transactions..."
        layoutId="activePaymentTab"
        filters={dynamicFilters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        rangeFilters={rangeFilters}
        onRangeFilterChange={handleRangeFilterChange}
      />
      {searchFilteredData.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative mb-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center">
              <CreditCard className="w-10 h-10 text-[#4CAF50]" strokeWidth={1.5} />
            </div>
            {/* Floating receipt icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-[#EAEAEA] flex items-center justify-center shadow-sm"
            >
              <Receipt className="w-4 h-4 text-[#97999D]" />
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-lg font-semibold text-[#494F57] mb-2"
          >
            {activeTab === "all"
              ? "No payments yet"
              : `No ${activeTab} payments`}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#97999D] text-sm max-w-xs mb-6"
          >
            {activeTab === "all"
              ? "Your payment history will appear here once you accept and pay for a quote."
              : `You don't have any payments with "${activeTab}" status.`}
          </motion.p>

          {/* CTA Button */}
          {activeTab === "all" && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/quotes")}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#F15D1E] text-white text-sm font-medium rounded-lg hover:bg-[#E54D0E] transition-colors"
            >
              <FileText className="w-4 h-4" />
              View Quotes
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}

          {/* Payment methods info */}
          {activeTab === "all" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 mt-8 text-xs text-[#B5B7BA]"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
                Card payments
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2196F3]" />
                Bank transfers
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF9800]" />
                Cash payments
              </span>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <DataTable columns={columns} data={searchFilteredData} />
      )}
    </div>
  );
}
