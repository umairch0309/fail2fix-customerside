import { ContactQuoteSection } from "@/components/marketing/contact-form";
import { PhoneLink } from "@/components/marketing/phone-link";
import {
  MarketingCard,
  MarketingContentSection,
  MarketingPageLayout,
} from "@/components/marketing/marketing-page-layout";
import {
  PHONE_DISPLAY,
  PHONE_HOURS,
} from "@/lib/marketing/constants";

const ContactPage = () => {
  return (
    <MarketingPageLayout
      tag="Contact"
      title="Get in touch"
      description="Speak to an MOT repair specialist, ask about collection availability, or send us a message — we're here to help."
      showPhoneCta
    >
      <MarketingContentSection className="!bg-cream">
        <div className="mx-auto grid max-w-[980px] gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <MarketingCard className="!p-5 sm:!p-6 md:!p-8">
            <h2 className="font-fraunces text-[1.25rem] font-bold text-navy sm:text-[1.4rem]">
              Send a message
            </h2>
            <p className="mt-2 text-[0.9rem] text-landing-slate">
              Get a repair quote using the same flow as our homepage.
            </p>
            <div className="mt-6">
              <ContactQuoteSection />
            </div>
          </MarketingCard>

          <MarketingCard className="flex flex-col justify-between bg-navy !p-5 text-cream sm:!p-6 md:!p-8">
            <div>
              <h2 className="font-fraunces text-[1.25rem] font-bold sm:text-[1.4rem]">
                Contact details
              </h2>
              <p className="mt-2 text-[0.9rem] text-cream/75">
                Prefer to speak to someone now? Call us during office hours.
              </p>

              <ul className="mt-8 space-y-6 text-[0.92rem]">
                <li>
                  <p className="font-jetbrains text-[0.7rem] tracking-[0.08em] text-amber uppercase">
                    Phone
                  </p>
                  <PhoneLink
                    source="contact_page"
                    className="mt-1 inline-block font-fraunces text-[1.2rem] font-bold text-cream hover:text-amber"
                  >
                    {PHONE_DISPLAY}
                  </PhoneLink>
                  <p className="mt-1 text-cream/60">{PHONE_HOURS}</p>
                </li>
                <li>
                  <p className="font-jetbrains text-[0.7rem] tracking-[0.08em] text-amber uppercase">
                    Email
                  </p>
                  <a
                    href="mailto:support@fail2fix.co.uk"
                    className="mt-1 inline-block font-semibold text-cream hover:text-amber"
                  >
                    support@fail2fix.co.uk
                  </a>
                </li>
              </ul>
            </div>

            <p className="mt-8 border-t border-cream/15 pt-6 text-[0.85rem] leading-relaxed text-cream/65">
              For MOT repair quotes, enter your registration on the homepage or
              use the Check My MOT button in the header.
            </p>
          </MarketingCard>
        </div>
      </MarketingContentSection>
    </MarketingPageLayout>
  );
};

export default ContactPage;
