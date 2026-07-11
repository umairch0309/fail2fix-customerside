import { COLLECTION_DISCLAIMER } from "@/lib/marketing/constants";
import { cn } from "@/lib/utils";

export function CollectionDisclaimer({
  className,
}: {
  className?: string;
}) {
  return (
    <p className={cn("text-[0.78rem] leading-relaxed text-landing-slate sm:text-[0.82rem]", className)}>
      {COLLECTION_DISCLAIMER}
    </p>
  );
}
