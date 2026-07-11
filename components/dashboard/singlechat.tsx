import React from "react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";

interface SinglechatProps {
  id?: string;
  name?: string;
  count?: number;
  seen?: boolean;
  message?: string;
  className?: string;
  time?: string;
}

const Singlechat: React.FC<SinglechatProps> = ({
  id = "1",
  className,
  name = "Saniya Fatima",
  message = "Hey! welcome to falcon overseas ",
  count = 0,
  seen = true,
  time = "2m",
}) => {
  return (
    <div className="border-b border-[#EAEAEA] flex gap-3 p-2 px-4 items-center py-4 hover:bg-[#F0F0F0]">
      <div className="relative">
        <UserAvatar id={id} name={name} size="lg" className="h-10 w-10 text-sm" />
        {!seen && Number(count) > 0 && (
          <div
            className={cn(
              "min-w-5 min-h-5 rounded-full bg-[#FD6900] absolute -right-1 -bottom-1 border-2 border-white text-[10px] flex items-center justify-center font-medium text-white",
              className
            )}
          >
            {count}
          </div>
        )}
      </div>
      <div className="flex gap-3 justify-between w-full items-start overflow-hidden">
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="font-semibold text-[0.9rem] truncate">{name}</div>
          <div className="font-medium text-[0.82rem] text-[#888A8B] truncate">
            {message}
          </div>
        </div>
        <div className="font-medium text-[0.82rem] text-[#888A8B] shrink-0 ml-2">{time}</div>
      </div>
    </div>
  );
};

export default Singlechat;
