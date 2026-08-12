import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { WebSocketProvider } from "@/components/websocket-provider";
import { PendingQuoteResume } from "@/components/pending-quote-resume";
import { requireRole, requireVerifiedAuth } from "@/lib/auth-utils";
import { Suspense } from "react";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side customer check - redirects admin users to login
  await requireVerifiedAuth("/login");
  await requireRole("customer", "/login");

  return (
    <WebSocketProvider>
      <div className="h-screen bg-[#F4F4F4] p-2 md:p-4 flex overflow-hidden">
        <SidebarProvider className="h-full">
          <AppSidebar />
          <main className="flex-1 min-w-0 bg-white rounded-xl border border-[#EAEAEA] flex flex-col overflow-hidden">
            <DashboardHeader />
            <div className="flex-1 min-h-0 overflow-auto">
              <Suspense fallback={null}>
                <PendingQuoteResume />
              </Suspense>
              {children}
            </div>
          </main>
        </SidebarProvider>
      </div>
    </WebSocketProvider>
  );
}
