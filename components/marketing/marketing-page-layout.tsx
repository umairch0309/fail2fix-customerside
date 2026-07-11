import Getaquote from "@/app/sections/home/getaquote";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";

interface MarketingPageLayoutProps {
  tag: string;
  title: string;
  description?: string;
  showPhoneCta?: boolean;
  showFinalCta?: boolean;
  children: React.ReactNode;
}

export function MarketingPageLayout({
  tag,
  title,
  description,
  showPhoneCta = false,
  showFinalCta = true,
  children,
}: MarketingPageLayoutProps) {
  return (
    <div className="min-h-screen bg-cream">
      <MarketingPageHero
        tag={tag}
        title={title}
        description={description}
        showPhoneCta={showPhoneCta}
      />
      {children}
      {showFinalCta ? <Getaquote /> : null}
    </div>
  );
}

export function MarketingContentSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`landing-section border-t border-line bg-white ${className}`}>
      <div className="landing-container">{children}</div>
    </section>
  );
}

export function MarketingCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[16px] border border-line bg-white p-6 shadow-[0_8px_32px_-12px_rgba(20,33,61,0.12)] sm:rounded-[20px] sm:p-8 md:p-10 ${className}`}
    >
      {children}
    </div>
  );
}
