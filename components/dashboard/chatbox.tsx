import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import clsx from "clsx";

const ChatboxVariants = cva(
  "p-4 text-[0.85rem] font-medium rounded-xl max-w-[450px]",
  {
    variants: {
      variant: {
        admin: "bg-white text-[#494F57] border border-[#EAEAEA]",
        student: "bg-[#FD6900] text-white",
      },
    },
    defaultVariants: {
      variant: "admin",
    },
  }
);

interface ChatboxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ChatboxVariants> {
  message: string;
  time?: string;
  isOwn?: boolean;
  showTime?: boolean;
  isGrouped?: boolean;
  className?: string;
}

const Chatbox: React.FC<ChatboxProps> = ({
  message,
  time,
  isOwn = false,
  showTime = true,
  isGrouped = false,
  variant,
  className,
  ...props
}) => {
  // Use isOwn to determine variant if not explicitly set
  const effectiveVariant = variant ?? (isOwn ? "student" : "admin");

  return (
    <div
      className={clsx(
        effectiveVariant === "student" ? "justify-end" : "justify-start",
        "flex"
      )}
    >
      <div className={clsx("flex flex-col text-[0.9rem]", showTime ? "gap-1" : "gap-0")}>
        <div
          className={cn(ChatboxVariants({ variant: effectiveVariant }), className)}
          {...props}
        >
          {message}
        </div>
        {showTime && time && (
          <div
            className={clsx(
              effectiveVariant === "student" ? "justify-end" : "justify-start",
              "px-1 text-[#81868C] text-[0.75rem] w-full flex"
            )}
          >
            <div>{time}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbox;
