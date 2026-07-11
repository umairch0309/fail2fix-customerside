import { twMerge } from "tailwind-merge";
import React from "react";

interface PaddingProps {
  children: React.ReactNode;
  className?: string;
}

export const Padding: React.FC<PaddingProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        "px-[1.5rem] xl:px-[1rem] w-full transition-all duration-500",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Padding;
