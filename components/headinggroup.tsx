import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingGroupVariants = cva("flex flex-col", {
  variants: {
    align: {
      left: "items-start text-left",
      center: "items-center text-center",
      right: "items-end text-right",
    },
    size: {
      sm: "gap-0.5",
      md: "gap-1",
      lg: "gap-2",
    },
  },
  defaultVariants: {
    align: "left",
    size: "md",
  },
});

const headingVariants = cva("font-sans font-semibold tracking-tight", {
  variants: {
    size: {
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const descriptionVariants = cva("font-sans font-medium tracking-[-0.1px] text-[#838383]", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface HeadingGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof headingGroupVariants> {
  heading: string;
  description?: string;
  headingClassName?: string;
  descriptionClassName?: string;
}

const HeadingGroup = ({
  heading,
  description,
  align,
  size,
  className,
  headingClassName,
  descriptionClassName,
  ...props
}: HeadingGroupProps) => {
  return (
    <div className={cn(headingGroupVariants({ align, size }), className)} {...props}>
      <div className={cn(headingVariants({ size }), headingClassName)}>{heading}</div>
      {description && (
        <div className={cn(descriptionVariants({ size }), descriptionClassName)}>
          {description}
        </div>
      )}
    </div>
  );
};

export { HeadingGroup, headingGroupVariants, headingVariants, descriptionVariants };
export default HeadingGroup;
