"use client";

interface MiniStatCardProps {
  title: string;
  value: string | number;
}

export function MiniStatCard({ title, value }: MiniStatCardProps) {
  return (
    <div className="bg-[#F9F9F9] rounded-xl md:rounded-3xl border border-[#EAEAEA] p-3 md:p-6 h-full">
      <p className="text-sm font-medium text-[#545960] mb-2 md:mb-4">{title}</p>
      <p className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#494F57]">{value}</p>
    </div>
  );
}
