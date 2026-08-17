"use client";

import { usePathname, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const link = linkMap[pathname];

  // Don't render footer link for certain pages
  if (link === null) {
    return null;
  }

  const displayLink = link || defaultLink;
  const preserved = new URLSearchParams();
  const email = searchParams.get("email");
  const name = searchParams.get("name");
  const callbackUrl = searchParams.get("callbackUrl");
  const forceLogin = searchParams.get("forceLogin");
  if (email) preserved.set("email", email);
  if (name) preserved.set("name", name);
  if (callbackUrl) preserved.set("callbackUrl", callbackUrl);
  // Keep forceLogin so /signup is not redirected to /dashboard by a stale cookie
  if (forceLogin === "1") preserved.set("forceLogin", "1");
  const query = preserved.toString();
  const href = query ? `${displayLink.href}?${query}` : displayLink.href;

  return (
    <p className="text-sm text-center text-[#838383]">
      {displayLink.text}{' '}
      <Link
        href={href}
        prefetch={false}
        className="text-[#F15D1E] font-medium hover:underline"
      >
        {displayLink.linkText}
      </Link>
    </p>
  );
}
