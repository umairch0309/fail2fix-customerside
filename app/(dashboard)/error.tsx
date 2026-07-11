"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold text-[#0E1716]">Something went wrong</h2>
      <p className="max-w-md text-sm text-[#7F8282]">
        An unexpected error occurred. Please try again or return to the dashboard.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} className="rounded-full">
          Try again
        </Button>
        <Button variant="outline" asChild className="rounded-full">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
