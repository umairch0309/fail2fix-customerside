import type { Metadata } from "next";
import {
  LegalContactBox,
  LegalFooterNote,
  LegalPageLayout,
  LegalSection,
} from "@/components/marketing/legal-page-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Fail2Fix privacy policy. Learn how we collect, use, and protect your personal data when you use our managed MOT repair service.",
};

const Page = () => {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="How we collect, use, store, and protect your personal data when you use Fail2Fix."
      lastUpdated="09/02/2026"
    >
      <LegalSection>
        <p>
          Fail2Fix (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is
          committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, store, and protect your personal data when you use
          our platform.
        </p>
        <p>
          Fail2Fix is a managed MOT repair service designed to help users
          understand MOT failures and organise repairs. We are not a garage and
          do not carry out vehicle repairs directly.
        </p>
      </LegalSection>

      <LegalSection title="1. Information We Collect">
        <p>We may collect the following information:</p>
        <ul>
          <li>
            Vehicle information (registration number, MOT status, failure data)
          </li>
          <li>Contact details (name, email address, telephone number)</li>
          <li>Location data (postcode)</li>
          <li>
            Technical data such as IP address, browser type, and device
            information
          </li>
        </ul>
        <p>
          Vehicle and MOT-related data may be retrieved from official or
          third-party sources where available.
        </p>
      </LegalSection>

      <LegalSection title="2. How We Use Your Data">
        <p>We use your data to:</p>
        <ul>
          <li>Display MOT failure information</li>
          <li>Provide repair options and platform functionality</li>
          <li>Communicate with you regarding enquiries or bookings</li>
          <li>Improve platform performance and user experience</li>
        </ul>
        <p className="!text-navy font-medium">
          We do not sell your personal data.
        </p>
      </LegalSection>

      <LegalSection title="3. Legal Basis for Processing">
        <p>We process personal data where necessary for:</p>
        <ul>
          <li>Performance of a contract</li>
          <li>Legitimate business interests</li>
          <li>Legal and regulatory compliance</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Data Sharing">
        <p>
          Your data may be shared with independent third-party garages solely
          for the purpose of facilitating repair enquiries or bookings. Fail2Fix
          does not control how third parties process your data and recommends
          reviewing their privacy policies.
        </p>
      </LegalSection>

      <LegalSection title="5. Data Storage and Security">
        <p>
          We take reasonable technical and organisational measures to protect
          your data. Data is retained only as long as necessary to provide the
          service or meet legal obligations.
        </p>
      </LegalSection>

      <LegalSection title="6. Your Rights">
        <p>
          You have the right to access, correct, or request deletion of your
          personal data, subject to legal requirements.
        </p>
      </LegalSection>

      <LegalSection title="7. Contact">
        <p>For privacy-related enquiries, contact:</p>
        <LegalContactBox>
          <p>
            <strong>Email:</strong> support@fail2fix.co.uk
          </p>
        </LegalContactBox>
      </LegalSection>

      <LegalFooterNote>
        By using our platform, you acknowledge that you have read, understood,
        and agree to be bound by this Privacy Policy.
      </LegalFooterNote>
    </LegalPageLayout>
  );
};

export default Page;
