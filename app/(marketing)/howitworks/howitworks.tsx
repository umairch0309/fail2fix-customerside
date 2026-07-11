import QuickSteps from "@/app/sections/home/quickSteps";
import CollectionDelivery from "@/app/sections/home/collection-delivery";
import PaymentAssist from "@/app/sections/home/payment-assist";
import Guarantee from "@/app/sections/home/guarantee";
import TrustMessaging from "@/app/sections/home/trust-messaging";
import { MarketingPageLayout } from "@/components/marketing/marketing-page-layout";

const HowItWorksPage = () => {
  return (
    <MarketingPageLayout
      tag="How it works"
      title="From failed MOT to road-ready"
      description="Enter your registration, see what failed, get a repair quote, and let Fail2Fix manage collection, the repair, and your return."
    >
      <QuickSteps />
      <CollectionDelivery />
      <PaymentAssist />
      <TrustMessaging />
      <Guarantee />
    </MarketingPageLayout>
  );
};

export default HowItWorksPage;
