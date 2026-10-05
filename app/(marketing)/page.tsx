import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/app/sections/home/hero";
import TrustBar from "@/app/sections/home/trust-bar";
import CollectionDelivery from "@/app/sections/home/collection-delivery";
import QuickSteps from "@/app/sections/home/quickSteps";
import { HomepageJsonLd } from "@/components/marketing/json-ld";
import { COLLECTION_DISCLAIMER, PHONE_DISPLAY, SITE_URL } from "@/lib/marketing/constants";

const TrustMessaging = dynamic(
  () => import("@/app/sections/home/trust-messaging"),
);
const Whyus = dynamic(() => import("@/app/sections/home/whyus"));
const TrustLogos = dynamic(() => import("@/components/marketing/trust-logos"));
const Guarantee = dynamic(() => import("@/app/sections/home/guarantee"));
const PaymentAssist = dynamic(
  () => import("@/app/sections/home/payment-assist"),
);
const AreasWeCover = dynamic(
  () => import("@/app/sections/home/areas-we-cover"),
);
const Getaquote = dynamic(() => import("@/app/sections/home/getaquote"));
const Guides = dynamic(() => import("@/app/sections/home/guides"));
const Faqs = dynamic(() => import("@/app/sections/home/faqs"));

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Fail2Fix — UK's #1 Managed MOT Repair Service",
  description: `Failed your MOT? Fail2Fix collects your vehicle, manages the repair, and returns it complete. Call ${PHONE_DISPLAY}. ${COLLECTION_DISCLAIMER}`,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Fail2Fix — UK's #1 Managed MOT Repair Service",
    description: `Failed your MOT? We collect, manage the repair, and return your vehicle. Call ${PHONE_DISPLAY}.`,
    url: SITE_URL,
    siteName: "Fail2Fix",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fail2Fix — UK's #1 Managed MOT Repair Service",
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
