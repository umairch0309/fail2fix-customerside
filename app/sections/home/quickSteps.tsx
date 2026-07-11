"use client";

import { useReveal } from "@/components/animations/use-reveal";

const steps = [
  {
    num: "01",
    title: "Enter your reg",
    description:
      "We pull your MOT history and failure details straight away.",
  },
  {
    num: "02",
    title: "See what failed",
    description:
      "Plain-English breakdown of every failed item and advisory.",
  },
  {
    num: "03",
    title: "We manage your repair",
    description:
      "Upfront pricing and a dedicated specialist to handle everything.",
  },
  {
    num: "04",
    title: "Book with 10% down",
    description: "Pay the rest only once your car passes its re-test.",
  },
];

const QuickSteps = () => {
  const ref = useReveal<HTMLDivElement>({
    selector: "[data-step-card]",
    stagger: 0.1,
    y: 22,
    start: "top 88%",
  });
  const headerRef = useReveal<HTMLDivElement>({ y: 24, start: "top 88%" });

  return (
    <section className="landing-section">
      <div className="landing-container">
        <div ref={headerRef} className="mb-8 max-w-[620px] sm:mb-10 md:mb-12">
          <div data-reveal>
            <span className="landing-tag">How it works</span>
            <h2 className="landing-heading">
              From failed MOT to road-ready, in four steps.
            </h2>
          </div>
        </div>

        <div ref={ref}>
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {steps.map((step) => (
              <div
                key={step.num}
                data-step-card
                className="brand-step-card rounded-[14px] border border-line bg-white px-5 pt-5 pb-8 sm:px-[22px] sm:pt-[22px] sm:pb-10"
              >
                <span className="mb-3 block font-jetbrains text-[0.8rem] font-bold text-amber-dark">
                  {step.num}
                </span>
                <h3 className="mb-2 font-fraunces text-[1rem] font-bold text-navy sm:text-[1.05rem]">
                  {step.title}
                </h3>
                <p className="pb-1 text-[0.85rem] leading-relaxed text-landing-slate sm:text-[0.88rem]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-[14px] border border-line bg-white lg:grid lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={`desktop-${step.num}`}
                data-step-card
                className={`brand-step-card relative px-6 pt-6 pb-10 ${index < steps.length - 1 ? "border-r border-line" : ""}`}
              >
                <span className="mb-4 block font-jetbrains text-[0.8rem] font-bold text-amber-dark">
                  {step.num}
                </span>
                <h3 className="mb-2 font-fraunces text-[1.05rem] font-bold text-navy">
                  {step.title}
                </h3>
                <p className="pb-1 text-[0.88rem] leading-relaxed text-landing-slate">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickSteps;
