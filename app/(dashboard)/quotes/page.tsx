"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/stores/dashboard-store";
import { DataTableToolbar } from "@/components/data-table";
import { QuoteCard } from "./quote-card";
import { useQuotes } from "@/hooks/use-quotes";
import type { QuoteStatus } from "@/types/quote";

const tabs = [
  { value: "all", label: "All" },
  { value: "sent", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
];

export default function QuotesPage() {
  const router = useRouter();
  const setHeader = useDashboardStore((state) => state.setHeader);
  const [activeTab, setActiveTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [rangeFilters, setRangeFilters] = useState<
    Record<string, [number, number]>
  >({});

  // Fetch quotes from API (only returns sent quotes, no drafts)
  const { data: quotes = [], isLoading } = useQuotes();

  useEffect(() => {
    setHeader({
      title: "Quotes",
      description: "View and manage your quotes",
      showBreadcrumbs: false,
      showButton: false,
    });
  }, [setHeader]);

  // Generate dynamic filters based on data
  const dynamicFilters = useMemo(() => {
    // Get min/max amounts for range filter
    const amounts = quotes.map((q) => parseFloat(q.total || "0"));
    const minAmount = amounts.length
      ? Math.floor(Math.min(...amounts) / 100) * 100
      : 0;
    const maxAmount = amounts.length
      ? Math.ceil(Math.max(...amounts) / 100) * 100
      : 10000;

    return [
      {
        key: "amount",
        label: "Amount Range",
        type: "range" as const,
        min: minAmount,
        max: maxAmount || 10000,
        step: 100,
        formatValue: (v: number) => `£${v.toLocaleString()}`,
      },
    ];
  }, [quotes]);

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

  const handleRangeFilterChange = (key: string, values: [number, number]) => {
    setRangeFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  // Filter data based on active tab and filters
  const filteredData = useMemo(() => {
    let data = quotes;

    // Tab filter
    if (activeTab !== "all") {
      data = data.filter(
        (quote) => quote.status === (activeTab as QuoteStatus)
      );
    }

    // Amount range filter
    const amountRange = rangeFilters.amount;
    if (amountRange) {
      data = data.filter((quote) => {
        const amount = parseFloat(quote.total || "0");
        return amount >= amountRange[0] && amount <= amountRange[1];
      });
    }

    return data;
  }, [quotes, activeTab, rangeFilters]);

  // Search filter
  const searchFilteredData = useMemo(() => {
    if (!searchValue) return filteredData;
    const search = searchValue.toLowerCase();
    return filteredData.filter(
      (quote) =>
        (quote.invoiceNumber?.toLowerCase() || "").includes(search) ||
        (quote.title?.toLowerCase() || "").includes(search)
    );
  }, [filteredData, searchValue]);

  return (
    <div className="space-y-4 px-3 md:px-5 pb-3 md:pb-4">
      <DataTableToolbar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search quotes..."
        layoutId="activeQuoteTab"
        filters={dynamicFilters}
        activeFilters={{}}
        onFilterChange={() => {}}
        rangeFilters={rangeFilters}
        onRangeFilterChange={handleRangeFilterChange}
      />
      {isLoading ? (
        <div className="flex flex-wrap gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-[200px] h-[280px] bg-gray-100 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : searchFilteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[280px] text-gray-500">
          <p>No quotes found</p>
          <p className="text-sm text-gray-400 mt-1">
            Quotes will appear here once sent to you
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {searchFilteredData.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              onClick={() => router.push(`/quotes/${quote.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
