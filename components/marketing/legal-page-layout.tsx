interface LegalPageLayoutProps {
  title: string;
  tag?: string;
  description?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  tag = "Legal",
  description,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-cream">
      <section className="relative overflow-hidden bg-gradient-to-b from-navy to-navy-light px-4 py-14 text-center text-cream sm:px-6 sm:py-16 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-[280px] w-[280px] -translate-x-1/2 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(255,140,50,0.35), transparent 70%)",
          }}
        />
        <div className="landing-container relative z-1">
          <span className="landing-tag !text-amber">{tag}</span>
          <h1 className="font-fraunces text-[2rem] leading-tight font-bold text-cream sm:text-[2.4rem] md:text-[2.75rem]">
            {title}
          </h1>
          {description ? (
            <p className="mx-auto mt-4 max-w-[560px] text-[0.95rem] text-cream/75 sm:text-[1.02rem]">
              {description}
            </p>
          ) : null}
          {lastUpdated ? (
            <p className="mt-4 font-jetbrains text-[0.72rem] tracking-wide text-cream/55 uppercase">
              Last updated: {lastUpdated}
            </p>
          ) : null}
        </div>
      </section>

      <section className="landing-section !pt-10 sm:!pt-12 md:!pt-14">
        <div className="landing-container">
          <div className="mx-auto max-w-[820px] rounded-[16px] border border-line bg-white p-6 shadow-[0_8px_32px_-12px_rgba(20,33,61,0.12)] sm:rounded-[20px] sm:p-8 md:p-10">
            <div className="legal-prose space-y-10">{children}</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      {title ? (
        <h2 className="font-fraunces text-[1.15rem] font-bold text-navy sm:text-[1.25rem]">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

export function LegalFooterNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-8">
      <p className="text-[0.88rem] leading-relaxed text-landing-slate">
        {children}
      </p>
    </div>
  );
}

export function LegalContactBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-line bg-cream/50 p-5 sm:p-6">
      {children}
    </div>
  );
}
