"use client";

import { cn } from "@/lib/utils";
import { PHONE_TEL } from "@/lib/marketing/constants";
import { trackPhoneClick } from "@/lib/marketing/phone-tracking";

interface PhoneLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  source?: string;
}

export function PhoneLink({
  children,
  className,
  source,
  onClick,
  ...props
}: PhoneLinkProps) {
  return (
    <a
      href={PHONE_TEL}
      className={cn(className)}
      onClick={(e) => {
        trackPhoneClick(source);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
