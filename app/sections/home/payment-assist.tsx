"use client";

import { useReveal } from "@/components/animations/use-reveal";
import { PAYMENT_ASSIST_TAGLINE } from "@/lib/marketing/constants";

const PaymentAssist = () => {
  const ref = useReveal<HTMLDivElement>({ y: 32, duration: 0.8, start: "top 88%" });

  return (
    <section id="payment-assist" className="landing-section border-t border-line bg-cream">
      <div className="landing-container">
        <div ref={ref}>
          <div
            data-reveal
            className="flex flex-col items-start gap-6 rounded-[16px] border border-line bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
          >
            <div className="flex items-center gap-4">
              <div
                aria-hidden="true"
                className="flex h-14 min-w-[3.5rem] shrink-0 items-center justify-center rounded-[12px] bg-navy px-2 font-jetbrains text-[0.58rem] font-bold tracking-wide text-amber sm:h-16 sm:min-w-[4rem] sm:text-[0.65rem]"
              >
                Payment
                <br />
                Assist
              </div>
              <div>
                <p className="font-jetbrains text-[0.72rem] tracking-[0.06em] text-amber uppercase">
                  Payment Assist
                </p>
                <h2 className="font-fraunces text-[1.25rem] font-bold text-navy sm:text-[1.4rem]">
                  {PAYMENT_ASSIST_TAGLINE}
                </h2>
                <p className="mt-1 text-[0.88rem] text-landing-slate sm:text-[0.92rem]">
                  Flexible finance for eligible customers booking an MOT repair
                  through Fail2Fix.
                </p>
              </div>
            </div>
            <p className="max-w-[300px] text-[0.85rem] text-landing-slate sm:text-right sm:text-[0.88rem]">
              Book with just a 10% deposit today and spread the remaining balance
              over manageable instalments where approved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentAssist;
