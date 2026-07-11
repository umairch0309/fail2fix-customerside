"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { FileX2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchValue?: string;
  filterKey?: string;
  filterValue?: string;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchValue = "",
  filterKey,
  filterValue,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Apply search filter
  React.useEffect(() => {
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue(searchValue);
    }
  }, [searchValue, searchKey, table]);

  // Apply tab/status filter
  React.useEffect(() => {
    if (filterKey && filterValue && filterValue !== "all") {
      table.getColumn(filterKey)?.setFilterValue(filterValue);
    } else if (filterKey) {
      table.getColumn(filterKey)?.setFilterValue("");
    }
  }, [filterValue, filterKey, table]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#EAEAEA] overflow-hidden bg-white">
        <Table className="w-full min-w-[800px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-[#F5F5F5] border-b border-[#EAEAEA]"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`text-[#35383B] font-medium text-sm py-3 ${
                      header.id === "actions" ? "w-[130px]" : ""
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow
                  key={`skeleton-${index}`}
                  className="border-b border-[#EAEAEA]"
                >
                  {columns.map((_, colIndex) => (
                    <TableCell
                      key={`skeleton-cell-${colIndex}`}
                      className="py-4"
                    >
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-[#EAEAEA] hover:bg-[#F9F9F9]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`py-4 ${
                        cell.column.id === "actions" ? "text-right pr-4" : ""
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-[400px]">
                  <div className="flex flex-col items-center justify-center h-full w-full text-center">
                    <div className="w-20 h-20 rounded-full bg-[#FFF4ED] flex items-center justify-center mb-4">
                      <FileX2
                        className="w-10 h-10 text-[#F97316]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-[#494F57] mb-1">
                      No results found
                    </h3>
                    <p className="text-sm text-[#97999D] max-w-[280px] text-wrap">
                      We couldn&apos;t find any data to display. Try adjusting
                      your filters or create a new entry.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
