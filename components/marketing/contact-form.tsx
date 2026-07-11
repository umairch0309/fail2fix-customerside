"use client";

import { useState } from "react";
import { PopupContactForm } from "@/components/marketing/popup-contact-form";
import CustomButton from "@/components/custombutton";

export function ContactQuoteSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <p className="text-[0.9rem] text-landing-slate">
        Enter your registration to see MOT defects and get a repair quote.
      </p>
      <div className="mt-6">
        <CustomButton
          type="button"
          onClick={() => setOpen(true)}
          className="w-full sm:w-auto"
        >
          Start your quote
        </CustomButton>
      </div>
      <PopupContactForm open={open} onOpenChange={setOpen} />
    </>
  );
}

/** @deprecated Use ContactQuoteSection — wired to live quote funnel */
export function ContactForm() {
  return <ContactQuoteSection />;
}
