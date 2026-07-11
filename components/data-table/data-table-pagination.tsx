"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-[#81868C]">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <span>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </span>
        )}
        {table.getFilteredSelectedRowModel().rows.length === 0 && (
          <span>
            Showing {table.getRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} results
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="h-8 px-3 text-[#494F57] border-[#EAEAEA] shadow-none"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
            .slice(0, 5)
            .map((page) => (
              <Button
                key={page}
                variant={
                  table.getState().pagination.pageIndex === page - 1
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => table.setPageIndex(page - 1)}
                className={`h-8 w-8 p-0 shadow-none ${
                  table.getState().pagination.pageIndex === page - 1
                    ? "bg-[#FD6900] hover:bg-[#E55F00] text-white"
                    : "text-[#494F57] border-[#EAEAEA]"
                }`}
              >
                {page}
              </Button>
            ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="h-8 px-3 text-[#494F57] border-[#EAEAEA] shadow-none"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
