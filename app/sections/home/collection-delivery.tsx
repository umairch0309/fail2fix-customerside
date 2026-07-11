"use client";

import { useReveal } from "@/components/animations/use-reveal";
import { CollectionDisclaimer } from "@/components/marketing/collection-disclaimer";
import { COLLECTION_STEPS } from "@/lib/marketing/constants";

const CollectionDelivery = () => {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.12, y: 28, start: "top 85%" });

  return (
    <section id="collection-delivery" className="landing-section border-t border-line bg-white">
      <div ref={ref} className="landing-container">
        <div data-reveal className="mb-8 max-w-[620px] sm:mb-10 md:mb-12">
          <span className="landing-tag">Collection & delivery</span>
          <h2 className="landing-heading">
            Free collection and delivery, managed from start to finish.
          </h2>
          <p className="mt-3 text-[0.92rem] text-landing-slate sm:text-[0.98rem]">
            We take the hassle out of a failed MOT. You don&apos;t need to visit
            a garage — we handle everything for you.
          </p>
          <CollectionDisclaimer className="mt-3" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          {COLLECTION_STEPS.map((step) => (
            <div
              key={step.num}
              data-reveal
              className="rounded-[14px] border border-line bg-cream/40 p-5 sm:p-[22px]"
            >
              <span className="mb-3 block font-jetbrains text-[0.8rem] font-bold text-amber-dark">
                {step.num}
              </span>
              <h3 className="mb-2 font-fraunces text-[1rem] font-bold text-navy sm:text-[1.05rem]">
                {step.title}
              </h3>
              <p className="text-[0.85rem] text-landing-slate sm:text-[0.88rem]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-[14px] border border-line bg-cream/40 lg:grid lg:grid-cols-4">
          {COLLECTION_STEPS.map((step, index) => (
            <div
              key={step.num}
              data-reveal
              className={`relative p-6 ${index < COLLECTION_STEPS.length - 1 ? "border-r border-line" : ""}`}
            >
              <span className="mb-4 block font-jetbrains text-[0.8rem] font-bold text-amber-dark">
                {step.num}
              </span>
              <h3 className="mb-2 font-fraunces text-[1.05rem] font-bold text-navy">
                {step.title}
              </h3>
              <p className="text-[0.88rem] leading-relaxed text-landing-slate">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionDelivery;
