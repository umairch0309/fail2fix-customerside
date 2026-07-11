import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold text-[#0E1716]">Page not found</h2>
      <p className="max-w-md text-sm text-[#7F8282]">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild className="rounded-full">
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
