import {
  FAQ_ITEMS,
  FAIL2FIX_LOGO,
  PHONE_DISPLAY,
  PHONE_TEL,
  SITE_URL,
} from "./constants";

export function buildHomepageSchema() {
  const organization = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Fail2Fix",
    url: SITE_URL,
    logo: `${SITE_URL}${FAIL2FIX_LOGO}`,
    telephone: PHONE_DISPLAY,
    description:
      "The UK's #1 managed MOT repair service. We collect your vehicle, manage the repair, and return it complete.",
  };

  const localBusiness = {
    "@type": "AutoRepair",
    "@id": `${SITE_URL}/#localbusiness`,
    name: "Fail2Fix",
    url: SITE_URL,
    telephone: PHONE_TEL.replace("tel:", ""),
    priceRange: "££",
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Fail2Fix",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  const faqPage = {
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, localBusiness, website, faqPage],
  };
}
