"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Columns3 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  totalCount: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  totalCount,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-3xl border border-[#EAEAEA] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-3 p-3 md:p-4 bg-white border-b border-[#EAEAEA]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#494F57]">
            {title} ({totalCount})
          </h2>
          <Button
            variant="outline"
            className="h-8 px-3 text-[#494F57] border-[#EAEAEA]"
          >
            <Columns3 className="h-4 w-4 mr-2" />
            Columns
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select defaultValue="7days">
            <SelectTrigger className="bg-white rounded-lg border border-[#EAEAEA] text-sm text-[#494F57] h-8 px-3 w-auto">
              <SelectValue placeholder="7 days" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="7days">7 days</SelectItem>
              <SelectItem value="30days">30 days</SelectItem>
              <SelectItem value="90days">90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="bg-white rounded-lg border border-[#EAEAEA] text-sm text-[#494F57] h-8 px-3 w-auto">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="all">Status</SelectItem>
              <SelectItem value="quote_requested">Quote requested</SelectItem>
              <SelectItem value="quote_rejected">Quote rejected</SelectItem>
              <SelectItem value="quote_accepted">Quote accepted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Table className="w-full min-w-[800px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-[#F5F5F5] border-b border-[#EAEAEA]">
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
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-b border-[#EAEAEA] hover:bg-[#F9F9F9]"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`py-4 ${
                      cell.column.id === "actions" ? "text-right pr-4" : ""
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
