import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FAIL2FIX_LOGO } from "@/lib/marketing/constants";

interface BrandLogoProps {
  className?: string;
  /** @deprecated All branding now uses the official logo image */
  light?: boolean;
  /** Override logo source — defaults to official Fail2Fix logo */
  src?: string;
  /** Logo display size */
  size?: "compact" | "default" | "header";
}

const sizeConfig = {
  compact: {
    width: 140,
    height: 40,
    className: "max-h-9 sm:max-h-10",
  },
  default: {
    width: 200,
    height: 56,
    className: "max-h-11 sm:max-h-12",
  },
  header: {
    width: 260,
    height: 72,
    className: "max-h-11 w-auto sm:max-h-14 md:max-h-16",
  },
} as const;

export function BrandLogo({
  className,
  src = FAIL2FIX_LOGO,
  size = "default",
}: BrandLogoProps) {
  const config = sizeConfig[size];

  return (
    <Link href="/" className={cn("flex min-w-0 items-center", className)}>
      <Image
        src={src}
        alt="Fail2Fix — UK's Managed MOT Repair Service"
        width={config.width}
        height={config.height}
        className={cn(
          "h-auto w-auto max-w-full object-contain object-left",
          config.className,
        )}
        priority
      />
    </Link>
  );
}
