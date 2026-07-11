"use client";

import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const {
    pageTitle,
    pageDescription,
    breadcrumbs,
    showBreadcrumbs,
    headerButton,
    showHeaderButton,
  } = useDashboardStore();

  if (!pageTitle && breadcrumbs.length === 0 && !showHeaderButton) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 py-3 md:px-5 md:py-4">
      <div>
        {showBreadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-sm text-[#81868C] mb-1">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-4 w-4" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-[#494F57]">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#494F57]">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {pageTitle && (
          <h1 className="text-base md:text-lg font-semibold text-[#494F57]">{pageTitle}</h1>
        )}
        {pageDescription && (
          <p className="text-xs md:text-sm text-[#97999D] tracking-[-0.1px] font-medium">{pageDescription}</p>
        )}
      </div>

      {showHeaderButton && headerButton && (
        <Button
          onClick={headerButton.onClick}
          className="bg-[#F15D1E] hover:bg-[#d9531a] text-white rounded-full px-4 py-2 md:py-2.5 gap-1 text-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          {headerButton.label}
        </Button>
      )}
    </div>
  );
}
