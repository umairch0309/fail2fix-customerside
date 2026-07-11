"use client";

import { useState, useEffect, useMemo } from "react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { DataTable, DataTableToolbar } from "@/components/data-table";
import { columns } from "./columns";
import { useRequests } from "@/hooks/use-requests";
import { NewRequestDialog } from "@/components/new-request-dialog";
import type { RequestStatus } from "@/types/request";

const tabs = [
  { value: "all", label: "All" },
  { value: "quote_requested", label: "Requested" },
  { value: "quote_sent", label: "Quote Sent" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "closed", label: "Closed" },
];

export default function RequestsPage() {
  const setHeader = useDashboardStore((state) => state.setHeader);
  const [activeTab, setActiveTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [showNewRequest, setShowNewRequest] = useState(false);

  // Fetch requests from API
  const { data: requests = [], isLoading } = useRequests();

  useEffect(() => {
    setHeader({
      title: "Requests",
      description: "All your required info in one place",
      showBreadcrumbs: false,
      button: {
        label: "New Request",
        onClick: () => setShowNewRequest(true),
      },
      showButton: true,
    });
  }, [setHeader]);

  // Generate dynamic filters based on data
  const dynamicFilters = useMemo(() => {
    const postcodes = [...new Set(requests.map((r) => r.postcode))];

    return [
      {
        key: "postcode",
        label: "Postcode",
        options: postcodes.map((pc) => ({
          value: pc,
          label: pc,
        })),
      },
    ];
  }, [requests]);

  const handleFilterChange = (key: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  // Filter data based on active tab
  const filteredData = useMemo(() => {
    let data = requests;

    // Tab filter
    if (activeTab !== "all") {
      data = data.filter((request) => request.status === activeTab as RequestStatus);
    }

    // Postcode filter
    if (activeFilters.postcode?.length) {
      data = data.filter((request) =>
        activeFilters.postcode.includes(request.postcode)
      );
    }

    return data;
  }, [requests, activeTab, activeFilters]);

  // Search filter
  const searchFilteredData = useMemo(() => {
    if (!searchValue) return filteredData;
    const search = searchValue.toLowerCase();
    return filteredData.filter(
      (request) =>
        request.name.toLowerCase().includes(search) ||
        request.vrm.toLowerCase().includes(search) ||
        request.postcode.toLowerCase().includes(search)
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
        searchPlaceholder="Search requests..."
        layoutId="activeRequestTab"
        filters={dynamicFilters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      />
      <DataTable
        columns={columns}
        data={searchFilteredData}
        isLoading={isLoading}
      />

      {/* New Request Dialog */}
      <NewRequestDialog
        open={showNewRequest}
        onOpenChange={setShowNewRequest}
      />
    </div>
  );
}
