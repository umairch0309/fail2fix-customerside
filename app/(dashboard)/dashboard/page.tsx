"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { MiniStatCard } from "@/components/dashboard/mini-stat-card";
import { DataTable } from "@/components/data-table";
import { createColumns } from "../requests/columns";
import { useRequests } from "@/hooks/use-requests";
import { useMyDashboardStats } from "@/hooks/use-dashboard";
import { useSession } from "@/lib/auth-client";
import { NewRequestDialog } from "@/components/new-request-dialog";
import QuoteDetailsSheet from "@/components/dashboard/quote-details-sheet";

export default function OverviewPage() {
  const setHeader = useDashboardStore((state) => state.setHeader);
  const [showNewRequest, setShowNewRequest] = useState(false);

  // Sheet state
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleViewDetails = useCallback((requestId: string) => {
    setSelectedRequestId(requestId);
    setIsSheetOpen(true);
  }, []);

  const columns = useMemo(() => createColumns(handleViewDetails), [handleViewDetails]);

  // Fetch requests from API
  const { data: requests = [], isLoading } = useRequests();

  // Fetch dashboard stats
  const { data: stats } = useMyDashboardStats();

  // Get user info from session
  const { data: session } = useSession();
  const userInfo = {
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "", // Phone not in session, will be fetched from user profile if needed
  };

  useEffect(() => {
    setHeader({
      title: "Overview",
      description: "Track your requests, quotes, orders and payments",
      showBreadcrumbs: false,
      button: {
        label: "New Request",
        onClick: () => setShowNewRequest(true),
      },
      showButton: true,
    });
  }, [setHeader]);

  return (
    <div className="space-y-4 px-3 md:px-5 pb-3 md:pb-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniStatCard title="My Requests" value={String(stats?.requests ?? 0)} />
        <MiniStatCard title="Quotes Received" value={String(stats?.quotesReceived ?? 0)} />
        <MiniStatCard title="Active Orders" value={String(stats?.activeOrders ?? 0)} />
        <MiniStatCard title="Pending Payments" value={String(stats?.pendingPayments ?? 0)} />
      </div>

      {/* Recent Requests Table */}
      <DataTable
        columns={columns}
        data={requests.slice(0, 5)}
        isLoading={isLoading}
      />

      {/* New Request Dialog */}
      <NewRequestDialog
        open={showNewRequest}
        onOpenChange={setShowNewRequest}
        defaultName={userInfo.name}
        defaultEmail={userInfo.email}
        defaultPhone={userInfo.phone}
      />

      {/* Quote Details Sheet */}
      <QuoteDetailsSheet
        requestId={selectedRequestId}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}
