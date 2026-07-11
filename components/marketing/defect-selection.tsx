"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import CustomButton from "@/components/custombutton";
import { useDefectsWithPricing } from "@/hooks/use-vehicles";
import type { MotDefectWithPricing } from "@/types/vehicle";
import { defectTypeConfig } from "@/types/vehicle";

interface DefectSelectionProps {
  motTestId: string;
  onBack: () => void;
  onSubmit: (selectedDefectIds: string[]) => void;
  isSubmitting: boolean;
}

export function DefectSelection({
  motTestId,
  onBack,
  onSubmit,
  isSubmitting,
}: DefectSelectionProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { data: defects, isLoading, isError, error } = useDefectsWithPricing(motTestId);

  const toggleDefect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (!defects) return;
    if (selectedIds.size === defects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(defects.map((d) => d.id)));
    }
  };

  const handleSubmit = () => {
    onSubmit(Array.from(selectedIds));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-[#FF8E5E] animate-spin" />
        <p className="text-[#7F8282] text-[0.9rem]">
          Fetching defect details...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-red-500 text-[0.9rem]">
          {error?.message || "Failed to load defect pricing."}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="text-[#FF8E5E] underline text-[0.9rem]"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!defects || defects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-[#7F8282] text-[0.9rem]">
          No defects found for this vehicle&apos;s latest MOT test.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="text-[#FF8E5E] underline text-[0.9rem]"
        >
          Go back
        </button>
      </div>
    );
  }

  const allSelected = selectedIds.size === defects.length;

  return (
    <div className="flex flex-col gap-3">
      {/* Defects List */}
      <div className="bg-[#F6F6F6] border border-[#e9e9e9] rounded-[20px] px-2 lg:px-0 py-6 lg:py-8 flex flex-col gap-4 overflow-y-auto max-h-[45vh] hide-scroll">
        {/* Select All Toggle */}
        <div className="flex items-center justify-between px-4 lg:px-8">
          <span className="text-[#211E25] text-[0.9rem] font-medium">
            {selectedIds.size} of {defects.length} selected
          </span>
          <button
            type="button"
            onClick={toggleAll}
            className="text-[#FF8E5E] text-[0.85rem] font-medium hover:underline"
          >
            {allSelected ? "Deselect all" : "Select all"}
          </button>
        </div>

        {/* Defect Items */}
        <div className="flex flex-col gap-2 px-4 lg:px-8">
          {defects.map((defect) => (
            <DefectItem
              key={defect.id}
              defect={defect}
              selected={selectedIds.has(defect.id)}
              onToggle={() => toggleDefect(defect.id)}
            />
          ))}
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 px-2 lg:px-4 pt-2 pb-2">
        <CustomButton
          type="button"
          onClick={onBack}
          normalColor="#E5E5E5"
          textColor="#0E1716"
          className="py-7 flex-1"
          disabled={isSubmitting}
        >
          Back
        </CustomButton>
        <CustomButton
          type="button"
          onClick={handleSubmit}
          normalColor="#ED5616"
          textColor="white"
          className="py-7 flex-[2]"
          disabled={selectedIds.size === 0 || isSubmitting}
          loading={isSubmitting}
          loadingText="Submitting..."
        >
          Submit Request
        </CustomButton>
      </div>
    </div>
  );
}

function DefectItem({
  defect,
  selected,
  onToggle,
}: {
  defect: MotDefectWithPricing;
  selected: boolean;
  onToggle: () => void;
}) {
  const config = defectTypeConfig[defect.type] || defectTypeConfig.ADVISORY;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full text-left bg-white border rounded-xl px-4 py-3 flex items-start gap-3 transition-colors ${
        selected
          ? "border-[#FF8E5E] ring-1 ring-[#FF8E5E]/30"
          : "border-[#e9e9e9] hover:border-gray-300"
      }`}
    >
      {/* Checkbox */}
      <div className="shrink-0 mt-0.5">
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
            selected
              ? "bg-[#FF8E5E] border-[#FF8E5E]"
              : "bg-white border-gray-300"
          }`}
        >
          {selected && (
            <svg
              className="w-3 h-3 text-white"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6l3 3 5-5" />
            </svg>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <p className="text-[#211E25] text-[0.85rem] leading-snug">
          {defect.text}
        </p>
        <span
          className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full border w-fit"
          style={{
            color: config.color,
            backgroundColor: config.bgColor,
            borderColor: config.borderColor,
          }}
        >
          {config.label}
        </span>
      </div>
    </button>
  );
}
