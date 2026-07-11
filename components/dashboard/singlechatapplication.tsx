import { cn } from "@/lib/utils";
import React from "react";

interface SinglechatapplicationProps {
  number?: number;
  classname?: string;
  progress?: string;
  date?: string;
  id?: string;
  country?: string;
}

const Singlechatapplication: React.FC<SinglechatapplicationProps> = ({
  number = 1,
  classname,
  progress = "In progress",
  date = "22/09/2025",
  id = "#64778HJX3839",
  country = "USA",
}) => {
  return (
    <div className={cn("px-3.5 py-3 border-b border-[#E6E6E6]", classname)}>
      <div className="text-[0.87rem] tracking-wide font-medium flex flex-col gap-1.5">
        <div className="text-[#1E1D1D] font-normal font-display">
          Visa Application for {country}
        </div>
        <div className="text-[#828283]">{id}</div>
        <div className="flex lg:justify-between gap-3.5 py-1.5 items-center">
          <div className="text-[#5C5C5C] bg-[#ECECEC] rounded-full px-2.5 py-1">
            {progress}
          </div>
          <div className="text-[#828283]">{date}</div>
        </div>
      </div>
    </div>
  );
};

export default Singlechatapplication;
