import type { Metadata } from "next";
import Hero from "@/app/sections/home/hero";
import TrustBar from "@/app/sections/home/trust-bar";
import CollectionDelivery from "@/app/sections/home/collection-delivery";
import TrustMessaging from "@/app/sections/home/trust-messaging";
import Faqs from "../sections/home/faqs";
import Getaquote from "../sections/home/getaquote";
import QuickSteps from "../sections/home/quickSteps";
import Guides from "../sections/home/guides";
import Whyus from "../sections/home/whyus";
import Guarantee from "../sections/home/guarantee";
import PaymentAssist from "@/app/sections/home/payment-assist";
import AreasWeCover from "@/app/sections/home/areas-we-cover";
import TrustLogos from "@/components/marketing/trust-logos";
import { HomepageJsonLd } from "@/components/marketing/json-ld";
import { COLLECTION_DISCLAIMER, PHONE_DISPLAY, SITE_URL } from "@/lib/marketing/constants";

export const metadata: Metadata = {
  title: "Fail2Fix — UK's Managed MOT Repair Service",
  description: `Failed your MOT? Fail2Fix collects your vehicle, manages the repair, and returns it complete. Call ${PHONE_DISPLAY}. ${COLLECTION_DISCLAIMER}`,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Fail2Fix — UK's Managed MOT Repair Service",
    description: `Failed your MOT? We collect, manage the repair, and return your vehicle. Call ${PHONE_DISPLAY}.`,
    url: SITE_URL,
    siteName: "Fail2Fix",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fail2Fix — UK's Managed MOT Repair Service",
    description: `Failed your MOT? We collect, manage the repair, and return your vehicle. Call ${PHONE_DISPLAY}.`,
  },
};

const Page = () => {
  return (
    <>
      <HomepageJsonLd />
      <div>
        <Hero />
        <TrustBar />
        <CollectionDelivery />
        <QuickSteps />
        <Whyus />
        <TrustLogos />
        <TrustMessaging />
        <Guarantee />
        <PaymentAssist />
        <AreasWeCover />
        <Getaquote />
        <Guides />
        <Faqs />
      </div>
    </>
  );
};

export default Page;
