import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import { QuoteEntryProvider } from "@/components/marketing/quote-entry-context";
import { FloatingCallButton } from "@/components/marketing/floating-call-button";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QuoteEntryProvider>
      <div className="w-full max-w-full overflow-x-hidden bg-cream pb-[calc(4rem+env(safe-area-inset-bottom))] text-navy md:pb-0">
        <Navbar />
        {children}
        <Toaster />
        <Footer />
        <FloatingCallButton />
      </div>
    </QuoteEntryProvider>
  );
}
