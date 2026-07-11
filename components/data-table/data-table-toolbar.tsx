"use client";

import { useState } from "react";
import { Search, Filter, ChevronDown, X, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Tab {
  value: string;
  label: string;
}

interface FilterOption {
  value: string;
  label: string;
}

interface RangeFilterConfig {
  key: string;
  label: string;
  type: "range";
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
}

interface CheckboxFilterConfig {
  key: string;
  label: string;
  type?: "checkbox";
  options: FilterOption[];
}

type FilterConfig = CheckboxFilterConfig | RangeFilterConfig;

interface DataTableToolbarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  layoutId: string;
  filters?: FilterConfig[];
  activeFilters?: Record<string, string[]>;
  onFilterChange?: (key: string, values: string[]) => void;
  rangeFilters?: Record<string, [number, number]>;
  onRangeFilterChange?: (key: string, values: [number, number]) => void;
}

export function DataTableToolbar({
  tabs,
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search",
  layoutId,
  filters = [],
  activeFilters = {},
  onFilterChange,
  rangeFilters = {},
  onRangeFilterChange,
}: DataTableToolbarProps) {
  // Pending state for filters (before Apply is clicked)
  const [pendingFilters, setPendingFilters] = useState<Record<string, string[]>>(activeFilters);
  const [pendingRangeFilters, setPendingRangeFilters] = useState<Record<string, [number, number]>>(rangeFilters);
  const [isOpen, setIsOpen] = useState(false);

  // Sync pending state when dropdown opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setPendingFilters(activeFilters);
      setPendingRangeFilters(rangeFilters);
    }
    setIsOpen(open);
  };

  const hasActiveCheckboxFilters = Object.values(activeFilters).some(
    (values) => values.length > 0
  );

  const hasActiveRangeFilters = filters.some((filter) => {
    if (filter.type === "range") {
      const range = rangeFilters[filter.key];
      return range && (range[0] !== filter.min || range[1] !== filter.max);
    }
    return false;
  });

  const hasActiveFilters = hasActiveCheckboxFilters || hasActiveRangeFilters;

  // Check if pending state differs from applied state
  const hasPendingChanges = () => {
    // Check checkbox filters
    for (const key of Object.keys(pendingFilters)) {
      const pending = pendingFilters[key] || [];
      const active = activeFilters[key] || [];
      if (pending.length !== active.length || !pending.every((v) => active.includes(v))) {
        return true;
      }
    }
    // Check range filters
    for (const filter of filters) {
      if (filter.type === "range") {
        const pending = pendingRangeFilters[filter.key];
        const active = rangeFilters[filter.key];
        if (pending && active && (pending[0] !== active[0] || pending[1] !== active[1])) {
          return true;
        }
      }
    }
    return false;
  };

  const togglePendingFilter = (key: string, value: string) => {
    const currentValues = pendingFilters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setPendingFilters((prev) => ({
      ...prev,
      [key]: newValues,
    }));
  };

  const applyFilters = () => {
    // Apply checkbox filters
    Object.keys(pendingFilters).forEach((key) => {
      if (onFilterChange) {
        onFilterChange(key, pendingFilters[key] || []);
      }
    });
    // Apply range filters
    Object.keys(pendingRangeFilters).forEach((key) => {
      if (onRangeFilterChange && pendingRangeFilters[key]) {
        onRangeFilterChange(key, pendingRangeFilters[key]);
      }
    });
    setIsOpen(false);
  };

  const clearAllFilters = () => {
    const clearedFilters: Record<string, string[]> = {};
    const clearedRangeFilters: Record<string, [number, number]> = {};

    filters.forEach((filter) => {
      if (filter.type === "range") {
        clearedRangeFilters[filter.key] = [filter.min, filter.max];
      } else {
        clearedFilters[filter.key] = [];
      }
    });

    setPendingFilters(clearedFilters);
    setPendingRangeFilters(clearedRangeFilters);
  };

  const getActiveFilterCount = () => {
    let count = Object.values(activeFilters).flat().length;
    filters.forEach((filter) => {
      if (filter.type === "range") {
        const range = rangeFilters[filter.key];
        if (range && (range[0] !== filter.min || range[1] !== filter.max)) {
          count += 1;
        }
      }
    });
    return count;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center bg-[#F8F8F8] rounded-lg p-1 gap-1 border border-[#EFEFEF]">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`relative px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.value
                ? "text-[#494F57]"
                : "text-[#81868C] hover:text-[#494F57]"
            }`}
          >
            {activeTab === tab.value && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-white rounded-md shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#97999D]" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-9 h-9 w-[200px] bg-white border-[#EAEAEA] rounded-lg text-sm"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {filters.length > 0 && (
          <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`h-9 px-3 text-[#494F57] border-[#EAEAEA] rounded-lg shadow-none ${
                  hasActiveFilters ? "bg-[#FFF8F3] border-[#FFE4D2]" : ""
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1.5 h-5 w-5 rounded-full bg-[#FD6900] text-white text-xs flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {filters.map((filter, index) => (
                <div key={filter.key}>
                  <DropdownMenuLabel className="text-[#81868C] text-xs font-medium">
                    {filter.label}
                  </DropdownMenuLabel>
                  {filter.type === "range" ? (
                    <div className="px-2 py-3">
                      <Slider
                        value={pendingRangeFilters[filter.key] || [filter.min, filter.max]}
                        min={filter.min}
                        max={filter.max}
                        step={filter.step || 1}
                        onValueChange={(value) => {
                          setPendingRangeFilters((prev) => ({
                            ...prev,
                            [filter.key]: value as [number, number],
                          }));
                        }}
                        className="w-full"
                      />
                      <div className="flex justify-between mt-2 text-xs text-[#81868C]">
                        <span>
                          {filter.formatValue
                            ? filter.formatValue(pendingRangeFilters[filter.key]?.[0] ?? filter.min)
                            : pendingRangeFilters[filter.key]?.[0] ?? filter.min}
                        </span>
                        <span>
                          {filter.formatValue
                            ? filter.formatValue(pendingRangeFilters[filter.key]?.[1] ?? filter.max)
                            : pendingRangeFilters[filter.key]?.[1] ?? filter.max}
                        </span>
                      </div>
                    </div>
                  ) : (
                    filter.options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm"
                        onClick={() => togglePendingFilter(filter.key, option.value)}
                      >
                        <Checkbox
                          checked={(pendingFilters[filter.key] || []).includes(option.value)}
                          onCheckedChange={() => togglePendingFilter(filter.key, option.value)}
                        />
                        <span className="text-sm text-[#494F57]">{option.label}</span>
                      </div>
                    ))
                  )}
                  {index < filters.length - 1 && <DropdownMenuSeparator />}
                </div>
              ))}
              <DropdownMenuSeparator />
              <div className="p-2 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearAllFilters();
                    // Apply cleared filters immediately and close
                    filters.forEach((filter) => {
                      if (filter.type === "range") {
                        if (onRangeFilterChange) {
                          onRangeFilterChange(filter.key, [filter.min, filter.max]);
                        }
                      } else {
                        if (onFilterChange) {
                          onFilterChange(filter.key, []);
                        }
                      }
                    });
                    setIsOpen(false);
                  }}
                  className="flex-1 h-8 text-[#FF1603] hover:text-[#FF1603] hover:bg-[#FFF8F8]"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={applyFilters}
                  className="flex-1 h-8 border-[#FD6900] text-[#FD6900] hover:bg-[#FFF8F3]"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Apply
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {filters.length === 0 && (
          <Button
            variant="outline"
            className="h-9 px-3 text-[#494F57] border-[#EAEAEA] rounded-lg shadow-none"
            disabled
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
