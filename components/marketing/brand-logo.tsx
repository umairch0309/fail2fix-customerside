import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  FAIL2FIX_LOGO,
  FAIL2FIX_LOGO_WHITE,
  BRAND_TAGLINE,
} from "@/lib/marketing/constants";

interface BrandLogoProps {
  className?: string;
  /** White logo for dark backgrounds */
  light?: boolean;
  /** Override logo source — defaults to official Fail2Fix logo */
  src?: string;
  /** Logo display size */
  size?: "compact" | "default" | "header" | "footer";
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
    width: 360,
    height: 100,
    className: "max-h-16 w-auto sm:max-h-[4.5rem] md:max-h-20",
  },
  footer: {
    width: 280,
    height: 72,
    className: "max-h-14 w-auto sm:max-h-16 md:max-h-[4.5rem]",
  },
} as const;

export function BrandLogo({
  className,
  light = false,
  src,
  size = "default",
}: BrandLogoProps) {
  const config = sizeConfig[size];
  const logoSrc = src ?? (light ? FAIL2FIX_LOGO_WHITE : FAIL2FIX_LOGO);

  return (
    <Link href="/" className={cn("flex min-w-0 items-center", className)}>
      <Image
        src={logoSrc}
        alt={`Fail2Fix — ${BRAND_TAGLINE}`}
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
