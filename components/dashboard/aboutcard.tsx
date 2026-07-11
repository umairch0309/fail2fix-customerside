import React from "react";
import { cn } from "@/lib/utils";

interface AboutcardProps {
  classname?: string;
  desc?: string;
  duration?: string;
}

const Aboutcard: React.FC<AboutcardProps> = ({
  classname = "border-b border-[#E6E6E6]",
  desc = "Completed Applications ",
  duration = "22",
}) => {
  return (
    <div>
      <div className="">
        <div
          className={cn("flex justify-between gap-4 py-2.5 px-4 w-full", classname)}
        >
          <div className="text-[#777777] font-medium text-[0.9rem]">
            {desc}
          </div>
          <div className="text-[#000000] font-medium text-[0.9rem]">
            {duration}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutcard;
