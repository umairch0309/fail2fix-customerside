"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const linkMap: Record<string, { text: string; linkText: string; href: string } | null> = {
  "/login": {
    text: "Don't have an account?",
    linkText: "Sign up",
    href: "/signup",
  },
  "/signup": {
    text: "Already have an account?",
    linkText: "Log in",
    href: "/login",
  },
  "/forgot-password": {
    text: "Remember your password?",
    linkText: "Log in",
    href: "/login",
  },
  "/verify-email": null,
};

const defaultLink = {
  text: "Don't have an account?",
  linkText: "Sign up",
  href: "/signup",
};

export default function AuthFooterLink() {
  const pathname = usePathname();
  const link = linkMap[pathname];

  // Don't render footer link for certain pages
  if (link === null) {
    return null;
  }

  const displayLink = link || defaultLink;

  return (
    <p className="text-sm text-center text-[#838383]">
      {displayLink.text}{' '}
      <Link href={displayLink.href} className="text-[#F15D1E] font-medium hover:underline">
        {displayLink.linkText}
      </Link>
    </p>
  );
}
