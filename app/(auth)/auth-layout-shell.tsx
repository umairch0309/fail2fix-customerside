"use client";

import { Suspense } from "react";
import Padding from "@/components/padding";
import AuthImage from "./AuthImage";
import AuthFooterLink from "./AuthFooterLink";
import Image from "next/image";
import { FAIL2FIX_LOGO } from "@/lib/marketing/constants";
import { useRouter } from "next/navigation";

export default function AuthLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <Padding className="h-screen grid grid-cols-1 lg:grid-cols-[minmax(400px,560px)_1fr] py-3 gap-4">
      <div className="flex flex-col p-8 overflow-auto bg-[#F5F5F5] rounded-xl">
        <Image
          onClick={() => router.push("/")}
          src={FAIL2FIX_LOGO}
          alt="Fail2Fix"
          width={180}
          height={52}
          className="h-11 w-auto cursor-pointer object-contain object-left sm:h-12"
        />

        <div className="flex-1 flex items-center justify-center py-6">
          <div className="flex w-full max-w-md flex-col items-center gap-6">
            {children}
            <Suspense fallback={null}>
              <AuthFooterLink />
            </Suspense>
          </div>
        </div>
      </div>
      <AuthImage />
    </Padding>
  );
}
