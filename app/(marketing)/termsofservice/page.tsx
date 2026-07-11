import type { Metadata } from "next";
import {
  LegalFooterNote,
  LegalPageLayout,
  LegalSection,
} from "@/components/marketing/legal-page-layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Fail2Fix terms of service. Terms and conditions for using the UK's managed MOT repair service.",
};

const Page = () => {
  return (
    <LegalPageLayout
      title="Terms of Service"
      description="The terms and conditions for using Fail2Fix as the UK's managed MOT repair service."
    >
      <LegalSection>
        <p>
          Fail2Fix is an independent managed MOT repair service and is not a
          garage. We provide information, repair management, and facilitation
          services only.
        </p>
        <p>
          Any repair agreement is between the customer and the selected repair
          provider. Fail2Fix accepts no liability for workmanship, delays, or
          outcomes of third-party repairs, except as required by law.
        </p>
      </LegalSection>

      <LegalFooterNote>
        By using our platform, you acknowledge that you have read, understood,
        and agree to be bound by these Terms of Service.
      </LegalFooterNote>
    </LegalPageLayout>
  );
};

export default Page;
