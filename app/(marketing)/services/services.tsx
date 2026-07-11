import TrustBar from "@/app/sections/home/trust-bar";
import QuickSteps from "@/app/sections/home/quickSteps";
import CollectionDelivery from "@/app/sections/home/collection-delivery";
import PaymentAssist from "@/app/sections/home/payment-assist";
import AreasWeCover from "@/app/sections/home/areas-we-cover";
import TrustMessaging from "@/app/sections/home/trust-messaging";
import { MarketingPageLayout } from "@/components/marketing/marketing-page-layout";

const ServicesPage = () => {
  return (
    <MarketingPageLayout
      tag="Services"
      title="Managed MOT repair services"
      description="From failed MOT diagnosis to collection, repair management, and return — Fail2Fix handles the full journey so you don't have to."
    >
      <TrustBar />
      <TrustMessaging />
      <QuickSteps />
      <CollectionDelivery />
      <PaymentAssist />
      <AreasWeCover />
    </MarketingPageLayout>
  );
};

export default ServicesPage;
