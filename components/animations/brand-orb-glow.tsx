interface BrandOrbGlowProps {
  variant?: "hero" | "section" | "cta";
  className?: string;
}

export function BrandOrbGlow({
  variant = "section",
  className = "",
}: BrandOrbGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={`brand-orb-field pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      data-variant={variant}
    >
      <span className="brand-orb brand-orb-orange brand-orb-a" />
      <span className="brand-orb brand-orb-navy brand-orb-b" />
      <span className="brand-orb-glow" />
    </div>
  );
}
