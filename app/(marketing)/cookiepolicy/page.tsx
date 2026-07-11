import type { Metadata } from "next";
import {
  LegalFooterNote,
  LegalPageLayout,
  LegalSection,
} from "@/components/marketing/legal-page-layout";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Fail2Fix cookie policy. Information about how we use cookies on our website.",
};

const Page = () => {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      description="How we use cookies to keep Fail2Fix running smoothly and improve your experience."
    >
      <LegalSection>
        <p>
          Fail2Fix uses cookies to ensure proper website functionality and
          improve performance. Cookies we may use include:
        </p>
        <ul>
          <li>
            <strong>Essential cookies</strong> (required for site operation)
          </li>
          <li>
            <strong>Performance and analytics cookies</strong> (to understand
            usage and improve the platform)
          </li>
        </ul>
      </LegalSection>

      <LegalSection>
        <p className="!text-navy font-medium">
          We do not use cookies for intrusive advertising or sell cookie data to
          third parties.
        </p>
        <p>
          You can control or disable cookies through your browser settings.
          Disabling cookies may affect website functionality.
        </p>
      </LegalSection>

      <LegalFooterNote>
        By continuing to use our platform, you consent to our use of cookies as
        described in this policy.
      </LegalFooterNote>
    </LegalPageLayout>
  );
};

export default Page;
