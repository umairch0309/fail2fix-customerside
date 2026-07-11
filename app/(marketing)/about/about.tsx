import TrustMessaging from "@/app/sections/home/trust-messaging";
import QuickSteps from "@/app/sections/home/quickSteps";
import Whyus from "@/app/sections/home/whyus";
import Guarantee from "@/app/sections/home/guarantee";
import CollectionDelivery from "@/app/sections/home/collection-delivery";
import {
  MarketingPageLayout,
} from "@/components/marketing/marketing-page-layout";

const AboutPage = () => {
  return (
    <MarketingPageLayout
      tag="About us"
      title="The UK's managed MOT repair service"
      description="Fail2Fix helps drivers move from a failed MOT to a repaired, road-ready vehicle — with collection, repair management, and return built in."
    >
      <TrustMessaging />
      <Whyus />
      <QuickSteps />
      <CollectionDelivery />
      <Guarantee />
    </MarketingPageLayout>
  );
};

export default AboutPage;
