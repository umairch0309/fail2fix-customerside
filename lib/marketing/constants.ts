export const SITE_URL = "https://fail2fix.co.uk";

export const PHONE_DISPLAY = "020 4541 4102";
export const PHONE_TEL = "tel:+442045414102";
export const PHONE_HOURS = "Mon–Fri | 08:30am – 5:30pm";

export const FAIL2FIX_LOGO = "/images/fail2fix-logo-navy.png";
/** White wordmark for dark backgrounds (footer, etc.) */
export const FAIL2FIX_LOGO_WHITE = "/images/fail2fix-logo-white.png";

export const BRAND_TAGLINE = "UK's #1 Managed MOT Repair Service";
export const BRAND_TAGLINE_SHORT = "UK's #1 managed MOT repair service";

export const COLLECTION_DISCLAIMER =
  "Free local collection & delivery subject to location, availability and booking criteria.";

export const PAYMENT_ASSIST_TAGLINE =
  "Spread the cost with Payment Assist (subject to approval).";

export const TRUST_MESSAGING_ITEMS = [
  "UK's #1 Managed MOT Repair Service",
  "Secure Online Payments",
  "Transparent Quotes",
  "Vetted Repair Network",
  "Payment Assist Available",
  "Free Local Collection & Delivery (subject to conditions)",
  "Dedicated Customer Support",
] as const;

export const TRUST_BAR_ITEMS = [
  "UK's #1 Managed MOT Repair Service",
  "Transparent Quotes",
  "Payment Assist Available",
  "Only 10% Deposit Required",
] as const;

export const COLLECTION_STEPS = [
  {
    num: "01",
    title: "We collect your vehicle",
    description:
      "We collect your vehicle from your home or workplace at a time that suits you.",
  },
  {
    num: "02",
    title: "We manage your repair",
    description:
      "We manage your repair from start to finish with one dedicated point of contact.",
  },
  {
    num: "03",
    title: "We return your vehicle",
    description:
      "We return your vehicle once the work has been completed to a high standard.",
  },
  {
    num: "04",
    title: "MOT retest arranged",
    description:
      "MOT retest arranged where required, so you can get back on the road quickly.",
  },
] as const;

export const WHY_CHOOSE_ITEMS = [
  {
    title: "Managed MOT repair service",
    description:
      "We organise your repair from start to finish — collection, updates, and return.",
  },
  {
    title: "Upfront pricing",
    description:
      "Clear repair pricing before you book, with no hidden fees or surprises.",
  },
  {
    title: "Free local collection & delivery",
    description:
      "Available throughout our local service area, subject to location, availability and booking criteria.",
  },
  {
    title: "Payment Assist available",
    description: PAYMENT_ASSIST_TAGLINE,
  },
  {
    title: "Same week repairs",
    description:
      "We aim to complete most repairs within the same week and often much sooner.",
  },
  {
    title: "Only 10% deposit required",
    description:
      "Book your repair with just a 10% deposit — pay the rest once your car is fixed.",
  },
  {
    title: "Dedicated customer support",
    description:
      "One dedicated point of contact throughout the entire repair process.",
  },
  {
    title: "Vetted repair network",
    description:
      "Quality-checked garages across our service area, managed by Fail2Fix.",
  },
] as const;

export const SERVICE_AREAS = [
  { name: "Streatham", slug: "streatham" },
  { name: "Streatham Vale", slug: "streatham-vale" },
  { name: "Croydon", slug: "croydon" },
  { name: "South Croydon", slug: "south-croydon" },
  { name: "Norbury", slug: "norbury" },
  { name: "Thornton Heath", slug: "thornton-heath" },
  { name: "Tooting", slug: "tooting" },
  { name: "Balham", slug: "balham" },
  { name: "Clapham", slug: "clapham" },
  { name: "Brixton", slug: "brixton" },
  { name: "Mitcham", slug: "mitcham" },
  { name: "Wimbledon", slug: "wimbledon" },
  { name: "Colliers Wood", slug: "colliers-wood" },
  { name: "Crystal Palace", slug: "crystal-palace" },
  { name: "Penge", slug: "penge" },
  { name: "Beckenham", slug: "beckenham" },
  { name: "Bromley", slug: "bromley" },
  { name: "West Wickham", slug: "west-wickham" },
  { name: "Purley", slug: "purley" },
  { name: "Sanderstead", slug: "sanderstead" },
  { name: "Addiscombe", slug: "addiscombe" },
  { name: "Sydenham", slug: "sydenham" },
  { name: "Dulwich", slug: "dulwich" },
  { name: "Forest Hill", slug: "forest-hill" },
  { name: "Catford", slug: "catford" },
  { name: "Lewisham", slug: "lewisham" },
  { name: "Camberwell", slug: "camberwell" },
  { name: "Elephant & Castle", slug: "elephant-and-castle" },
  { name: "Kennington", slug: "kennington" },
  { name: "Stockwell", slug: "stockwell" },
  { name: "Wandsworth", slug: "wandsworth" },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Is Fail2Fix a garage?",
    answer:
      "No. Fail2Fix is a managed MOT repair service. We organise your repair from start to finish, including collection, repair management, customer updates and returning your vehicle once the work has been completed.",
    defaultOpen: true,
  },
  {
    question: "Will I receive sales calls?",
    answer:
      "No. Checking your MOT failure is completely free and there is no obligation to proceed. If you need advice, simply call 020 4541 4102 and one of our MOT specialists will be happy to help.",
  },
  {
    question: "Can I legally drive after failing my MOT?",
    answer:
      "It depends on the reason for the failure. If your vehicle has received a Dangerous defect it should not be driven until repaired. If you're unsure, simply give us a call and we'll advise you.",
  },
  {
    question: "How do you access my MOT information?",
    answer:
      "We securely retrieve your latest MOT results from the official DVSA MOT database using your vehicle registration.",
  },
  {
    question: "Do I pay anything to check my MOT?",
    answer:
      "No. Checking your MOT failure and receiving a repair quotation is completely free. You only pay a 10% deposit if you choose to book your repair.",
  },
  {
    question: "Can you collect my vehicle from home?",
    answer: `Yes. We offer collection and delivery throughout our service area, making the repair process simple and convenient. ${COLLECTION_DISCLAIMER}`,
  },
  {
    question: "Can you collect my vehicle from work?",
    answer: `Yes. We regularly collect vehicles from workplaces and return them once repairs have been completed. ${COLLECTION_DISCLAIMER}`,
  },
  {
    question: "How long do repairs normally take?",
    answer:
      "Many MOT repairs can be completed within 24–48 hours depending on parts availability. We'll always keep you informed throughout the repair.",
  },
  {
    question: "Can I spread the cost?",
    answer: `Yes. ${PAYMENT_ASSIST_TAGLINE}`,
  },
  {
    question: "How quickly can you repair my vehicle?",
    answer:
      "We aim to complete most repairs within the same week and often much sooner.",
  },
  {
    question: "Do you offer free collection and delivery?",
    answer: `Yes. ${COLLECTION_DISCLAIMER}`,
  },
  {
    question: "What happens after I accept my quote?",
    answer:
      "We'll arrange collection, manage the repair, carry out any required MOT retest and return your vehicle once everything has been completed. You'll have one dedicated point of contact throughout the entire process.",
  },
  {
    question: "Do you use quality replacement parts?",
    answer:
      "Yes. We use quality replacement parts from trusted suppliers and can also fit genuine manufacturer parts where requested.",
  },
  {
    question: "Why choose Fail2Fix?",
    answer:
      "Fail2Fix removes the hassle of dealing with a failed MOT. From your first enquiry through to your repaired vehicle being returned, we manage the entire process for you, including collection, repair management, customer updates and flexible payment options, making getting your vehicle back on the road as simple as possible.",
  },
] as const;

export const TRUST_LOGOS = [
  { id: "dvsa", label: "DVSA MOT Lookup", sublabel: "Official data" },
  { id: "stripe", label: "Stripe Secure Payments", sublabel: "Secure checkout" },
  {
    id: "payment-assist",
    label: "Payment Assist",
    sublabel: "Subject to approval",
  },
  { id: "aa", label: "AA Approved", sublabel: "Trusted network" },
] as const;
