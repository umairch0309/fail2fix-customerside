import { LOCATION_FAQS } from "./locations/shared";
import type { LocationPageData } from "./locations/types";
import { PHONE_DISPLAY, SITE_URL } from "./constants";

export function buildLocationAutoRepairSchema(page: LocationPageData) {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: "Fail2Fix",
    url: `${SITE_URL}/mot-repairs-${page.slug}`,
    telephone: PHONE_DISPLAY,
    areaServed: {
      "@type": "Place",
      name: page.name,
    },
    serviceType: "Managed MOT repair service",
    openingHours: "Mo-Fr 08:30-17:30",
  };
}

export function buildLocationFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: LOCATION_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildLocationPageSchema(page: LocationPageData) {
  return [buildLocationAutoRepairSchema(page), buildLocationFaqSchema()];
}
