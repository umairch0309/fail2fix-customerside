import { BrandLogo } from "@/components/marketing/brand-logo";
import Link from "next/link";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <header className="border-b border-[#EAEAEA] bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4">
          <Link href="/" aria-label="Fail2Fix home">
            <BrandLogo size="compact" />
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
