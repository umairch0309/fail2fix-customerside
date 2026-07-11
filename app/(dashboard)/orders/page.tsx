"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Package, FileText, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/stores/dashboard-store";
import { DataTableToolbar } from "@/components/data-table";
import { OrderCard } from "./order-card";
import { useOrders } from "@/hooks/use-orders";
import { Skeleton } from "@/components/ui/skeleton";

const tabs = [
  { value: "all", label: "All" },
  { value: "created", label: "Created" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
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

  const { data: orders = [], isLoading } = useOrders();

  useEffect(() => {
    setHeader({
      title: "Orders",
      description: "Track your orders and their status",
      showBreadcrumbs: false,
      showButton: false,
    });
  }, [setHeader]);

  // Generate dynamic filters based on data
  const dynamicFilters = useMemo(() => {
    if (!orders.length) return [];

    // Get min/max amounts for range filter
    const amounts = orders.map((o) => parseFloat(o.quoteTotal));
    const minAmount = Math.floor(Math.min(...amounts) / 100) * 100;
    const maxAmount = Math.ceil(Math.max(...amounts) / 100) * 100;

    return [
      {
        key: "amount",
        label: "Amount Range",
        type: "range" as const,
        min: minAmount || 0,
        max: maxAmount || 10000,
        step: 100,
        formatValue: (v: number) => `£${v.toLocaleString()}`,
      },
      {
        key: "hasNotes",
        label: "Notes",
        options: [
          { value: "yes", label: "Has Notes" },
          { value: "no", label: "No Notes" },
        ],
      },
    ];
  }, [orders]);

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
    let data = orders;

    // Tab filter
    if (activeTab !== "all") {
      data = data.filter((order) => order.status === activeTab);
    }

    // Amount range filter
    const amountRange = rangeFilters.amount;
    if (amountRange) {
      data = data.filter((order) => {
        const amount = parseFloat(order.quoteTotal);
        return amount >= amountRange[0] && amount <= amountRange[1];
      });
    }

    // Notes filter
    if (activeFilters.hasNotes?.length) {
      data = data.filter((order) => {
        const hasNotes = !!order.notes;
        return activeFilters.hasNotes.some((value) => {
          if (value === "yes") return hasNotes;
          if (value === "no") return !hasNotes;
          return false;
        });
      });
    }

    return data;
  }, [activeTab, activeFilters, rangeFilters, orders]);

  // Search filter
  const searchFilteredData = useMemo(() => {
    if (!searchValue) return filteredData;
    const search = searchValue.toLowerCase();
    return filteredData.filter(
      (order) =>
        (order.quoteTitle &&
          order.quoteTitle.toLowerCase().includes(search)) ||
        order.orderNumber.toLowerCase().includes(search)
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
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
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
        searchPlaceholder="Search orders..."
        layoutId="activeOrderTab"
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
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFF4EC] to-[#FFE8D9] flex items-center justify-center">
              <Package className="w-10 h-10 text-[#F15D1E]" strokeWidth={1.5} />
            </div>
            {/* Floating badge */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-[#EAEAEA] flex items-center justify-center shadow-sm"
            >
              <span className="text-sm font-semibold text-[#97999D]">0</span>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-lg font-semibold text-[#494F57] mb-2"
          >
            {activeTab === "all" ? "No orders yet" : `No ${activeTab.replace("_", " ")} orders`}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#97999D] text-sm max-w-xs mb-6"
          >
            {activeTab === "all"
              ? "Orders appear here once a quote is accepted. Start by requesting a quote!"
              : `You don't have any orders with "${activeTab.replace("_", " ")}" status.`}
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

          {/* Steps indicator */}
          {activeTab === "all" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 mt-8 text-xs text-[#B5B7BA]"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#F0F0F0] flex items-center justify-center text-[10px] font-medium text-[#97999D]">1</span>
                Request Quote
              </span>
              <span className="w-4 h-px bg-[#E0E0E0]" />
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#F0F0F0] flex items-center justify-center text-[10px] font-medium text-[#97999D]">2</span>
                Accept & Pay
              </span>
              <span className="w-4 h-px bg-[#E0E0E0]" />
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#F0F0F0] flex items-center justify-center text-[10px] font-medium text-[#97999D]">3</span>
                Track Order
              </span>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <div className="flex flex-col gap-4">
          {searchFilteredData.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
