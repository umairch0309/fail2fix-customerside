import type { LocationPageData } from "./types";
import { DIFFERENTIATOR_TEMPLATE } from "./shared";

const META_DESCRIPTION =
  "Failed your MOT in {area}? Fail2Fix arranges managed MOT repairs with fast quotes, free local collection and delivery in selected areas, and Payment Assist where eligible.";

function metaDescription(area: string) {
  return META_DESCRIPTION.replace("{area}", area);
}

function metaTitle(area: string) {
  return `MOT Repairs ${area} | Failed MOT Repair Quote | Fail2Fix`;
}

function aioSummary(area: string) {
  return `Fail2Fix provides managed MOT repair support in ${area}. The service helps drivers get a repair quote after a failed MOT, arrange booking support, use free local collection and delivery in selected areas, and access Payment Assist where eligible. Common repair categories include brakes, tyres, suspension, steering, lighting, exhaust and emissions faults.`;
}

function collectionCopy(area: string) {
  return `Free local collection and delivery is one of the strongest reasons to choose Fail2Fix in ${area}. Where available, it removes the need to arrange lifts, taxis or time off work to move the vehicle. Availability should always be confirmed at booking because coverage depends on location, diary capacity and the repair type.`;
}

export const LOCATION_PAGES: LocationPageData[] = [
  {
    slug: "streatham",
    name: "Streatham",
    h1: "MOT Repairs in Streatham",
    metaTitle: metaTitle("Streatham"),
    metaDescription: metaDescription("Streatham"),
    intro:
      "Failed your MOT in Streatham? Fail2Fix helps drivers move from failed test to repaired vehicle without the usual back-and-forth. Enter your registration, tell us what failed, and we will help arrange a repair quote through a managed MOT repair process.",
    coverage:
      "This page is for drivers around Streatham High Road, Streatham Common and Streatham Hill. We also commonly help drivers from Norbury, Furzedown, Tulse Hill and West Norwood, subject to collection availability and workshop capacity. The service is designed for people who need a clear repair route after an MOT failure rather than a vague estimate or a long wait for a call back.",
    differentiator: DIFFERENTIATOR_TEMPLATE,
    commonRepairs: [
      "brake imbalance from stop-start A23 driving",
      "worn suspension arms from speed humps and urban roads",
      "tyre defects picked up at MOT",
      "lighting and number-plate lamp issues",
      "emissions faults from short local journeys",
    ],
    commonRepairsNote:
      "These are not fixed-price items because MOT failures vary by vehicle, parts availability and labour time. The correct process is to check the failure items, confirm the required repair, then issue a proper quotation before the vehicle is booked.",
    whyLocal:
      "A failed MOT usually creates urgency. The car may be needed for work, school runs, family commitments or commuting. Around A23 and South Circular routes, losing a vehicle for several days can become disruptive quickly. Fail2Fix is designed for that moment: fast contact, a direct quotation route, and a clear repair plan.",
    collectionCopy: collectionCopy("Streatham"),
    paymentAssistCopy:
      "Some MOT repairs come at the wrong time financially. Where eligible, Payment Assist can help drivers spread the cost instead of delaying safety-critical repairs. This should be presented clearly on the page as an option, not a guaranteed approval.",
    aioSummary: aioSummary("Streatham"),
    nearbyAreas: [
      { name: "Norbury" },
      { name: "Furzedown" },
      { name: "Tulse Hill" },
      { name: "West Norwood" },
      { name: "Balham", slug: "balham" },
      { name: "Tooting", slug: "tooting" },
    ],
    keywords: [
      "MOT repairs Streatham",
      "failed MOT repairs Streatham",
      "MOT failure repair quote Streatham",
      "MOT repair collection Streatham",
      "car failed MOT Streatham",
    ],
  },
  {
    slug: "croydon",
    name: "Croydon",
    h1: "MOT Repairs in Croydon",
    metaTitle: metaTitle("Croydon"),
    metaDescription: metaDescription("Croydon"),
    intro:
      "Failed your MOT in Croydon? Fail2Fix helps drivers move from failed test to repaired vehicle without the usual back-and-forth. Enter your registration, tell us what failed, and we will help arrange a repair quote through a managed MOT repair process.",
    coverage:
      "This page is for drivers around Croydon town centre, South Croydon and Purley Way. We also commonly help drivers from Purley, Sanderstead, Addington and Shirley, subject to collection availability and workshop capacity. The service is designed for people who need a clear repair route after an MOT failure rather than a vague estimate or a long wait for a call back.",
    differentiator: DIFFERENTIATOR_TEMPLATE,
    commonRepairs: [
      "brakes, tyres and suspension from heavier commuting mileage",
      "exhaust and emissions faults",
      "steering and ball-joint wear",
      "warning lamps and electrical faults",
      "headlamp aim and lighting defects",
    ],
    commonRepairsNote:
      "These are not fixed-price items because MOT failures vary by vehicle, parts availability and labour time. The correct process is to check the failure items, confirm the required repair, then issue a proper quotation before the vehicle is booked.",
    whyLocal:
      "A failed MOT usually creates urgency. The car may be needed for work, school runs, family commitments or commuting. Around A23, A232 and Purley Way corridors, losing a vehicle for several days can become disruptive quickly. Fail2Fix is designed for that moment: fast contact, a direct quotation route, and a clear repair plan.",
    collectionCopy: collectionCopy("Croydon"),
    paymentAssistCopy:
      "Some MOT repairs come at the wrong time financially. Where eligible, Payment Assist can help drivers spread the cost instead of delaying safety-critical repairs. This should be presented clearly on the page as an option, not a guaranteed approval.",
    aioSummary: aioSummary("Croydon"),
    nearbyAreas: [
      { name: "Purley" },
      { name: "Sanderstead" },
      { name: "Addington" },
      { name: "Shirley" },
      { name: "Bromley", slug: "bromley" },
      { name: "Mitcham", slug: "mitcham" },
    ],
    keywords: [
      "MOT repairs Croydon",
      "failed MOT repairs Croydon",
      "MOT failure repair quote Croydon",
      "MOT repair collection Croydon",
      "car failed MOT Croydon",
    ],
  },
  {
    slug: "wimbledon",
    name: "Wimbledon",
    h1: "MOT Repairs in Wimbledon",
    metaTitle: metaTitle("Wimbledon"),
    metaDescription: metaDescription("Wimbledon"),
    intro:
      "Failed your MOT in Wimbledon? Fail2Fix helps drivers move from failed test to repaired vehicle without the usual back-and-forth. Enter your registration, tell us what failed, and we will help arrange a repair quote through a managed MOT repair process.",
    coverage:
      "This page is for drivers around Wimbledon town centre, South Wimbledon and Wimbledon Village. We also commonly help drivers from Raynes Park, Morden, Colliers Wood and New Malden, subject to collection availability and workshop capacity. The service is designed for people who need a clear repair route after an MOT failure rather than a vague estimate or a long wait for a call back.",
    differentiator: DIFFERENTIATOR_TEMPLATE,
    commonRepairs: [
      "brake wear from daily commuting",
      "tyres and wheel alignment issues",
      "suspension knocks over local traffic-calming roads",
      "emissions and engine-management faults",
      "parking-brake efficiency failures",
    ],
    commonRepairsNote:
      "These are not fixed-price items because MOT failures vary by vehicle, parts availability and labour time. The correct process is to check the failure items, confirm the required repair, then issue a proper quotation before the vehicle is booked.",
    whyLocal:
      "A failed MOT usually creates urgency. The car may be needed for work, school runs, family commitments or commuting. Around A24 and local commuter routes, losing a vehicle for several days can become disruptive quickly. Fail2Fix is designed for that moment: fast contact, a direct quotation route, and a clear repair plan.",
    collectionCopy: collectionCopy("Wimbledon"),
    paymentAssistCopy:
      "Some MOT repairs come at the wrong time financially. Where eligible, Payment Assist can help drivers spread the cost instead of delaying safety-critical repairs. This should be presented clearly on the page as an option, not a guaranteed approval.",
    aioSummary: aioSummary("Wimbledon"),
    nearbyAreas: [
      { name: "Raynes Park" },
      { name: "Morden" },
      { name: "Colliers Wood" },
      { name: "New Malden" },
      { name: "Mitcham", slug: "mitcham" },
      { name: "Tooting", slug: "tooting" },
    ],
    keywords: [
      "MOT repairs Wimbledon",
      "failed MOT repairs Wimbledon",
      "MOT failure repair quote Wimbledon",
      "MOT repair collection Wimbledon",
      "car failed MOT Wimbledon",
    ],
  },
  {
    slug: "clapham",
    name: "Clapham",
    h1: "MOT Repairs in Clapham",
    metaTitle: metaTitle("Clapham"),
    metaDescription: metaDescription("Clapham"),
    intro:
      "Failed your MOT in Clapham? Fail2Fix helps drivers move from failed test to repaired vehicle without the usual back-and-forth. Enter your registration, tell us what failed, and we will help arrange a repair quote through a managed MOT repair process.",
    coverage:
      "This page is for drivers around Clapham Common, Clapham North and Clapham South. We also commonly help drivers from Battersea, Stockwell, Balham and Nine Elms, subject to collection availability and workshop capacity. The service is designed for people who need a clear repair route after an MOT failure rather than a vague estimate or a long wait for a call back.",
    differentiator: DIFFERENTIATOR_TEMPLATE,
    commonRepairs: [
      "brake and tyre defects from dense urban traffic",
      "suspension wear from speed bumps",
      "lighting faults",
      "emissions failures from short journeys",
      "wiper and washer problems",
    ],
    commonRepairsNote:
      "These are not fixed-price items because MOT failures vary by vehicle, parts availability and labour time. The correct process is to check the failure items, confirm the required repair, then issue a proper quotation before the vehicle is booked.",
    whyLocal:
      "A failed MOT usually creates urgency. The car may be needed for work, school runs, family commitments or commuting. Around A3, A24 and South Circular connections, losing a vehicle for several days can become disruptive quickly. Fail2Fix is designed for that moment: fast contact, a direct quotation route, and a clear repair plan.",
    collectionCopy: collectionCopy("Clapham"),
    paymentAssistCopy:
      "Some MOT repairs come at the wrong time financially. Where eligible, Payment Assist can help drivers spread the cost instead of delaying safety-critical repairs. This should be presented clearly on the page as an option, not a guaranteed approval.",
    aioSummary: aioSummary("Clapham"),
    nearbyAreas: [
      { name: "Battersea" },
      { name: "Stockwell" },
      { name: "Balham", slug: "balham" },
      { name: "Nine Elms" },
      { name: "Brixton", slug: "brixton" },
    ],
    keywords: [
      "MOT repairs Clapham",
      "failed MOT repairs Clapham",
      "MOT failure repair quote Clapham",
      "MOT repair collection Clapham",
      "car failed MOT Clapham",
    ],
  },
  {
    slug: "brixton",
    name: "Brixton",
    h1: "MOT Repairs in Brixton",
    metaTitle: metaTitle("Brixton"),
    metaDescription: metaDescription("Brixton"),
    intro:
      "Failed your MOT in Brixton? Fail2Fix helps drivers move from failed test to repaired vehicle without the usual back-and-forth. Enter your registration, tell us what failed, and we will help arrange a repair quote through a managed MOT repair process.",
    coverage:
      "This page is for drivers around Brixton Hill, Acre Lane and central Brixton. We also commonly help drivers from Herne Hill, Tulse Hill, Stockwell and Camberwell, subject to collection availability and workshop capacity. The service is designed for people who need a clear repair route after an MOT failure rather than a vague estimate or a long wait for a call back.",
    differentiator: DIFFERENTIATOR_TEMPLATE,
    commonRepairs: [
      "emissions failures linked to short trips",
      "brake wear from stop-start driving",
      "suspension noise and worn bushes",
      "tyres, punctures and sidewall damage",
      "lighting and electrical faults",
    ],
    commonRepairsNote:
      "These are not fixed-price items because MOT failures vary by vehicle, parts availability and labour time. The correct process is to check the failure items, confirm the required repair, then issue a proper quotation before the vehicle is booked.",
    whyLocal:
      "A failed MOT usually creates urgency. The car may be needed for work, school runs, family commitments or commuting. Around A23 and South London commuter routes, losing a vehicle for several days can become disruptive quickly. Fail2Fix is designed for that moment: fast contact, a direct quotation route, and a clear repair plan.",
    collectionCopy: collectionCopy("Brixton"),
    paymentAssistCopy:
      "Some MOT repairs come at the wrong time financially. Where eligible, Payment Assist can help drivers spread the cost instead of delaying safety-critical repairs. This should be presented clearly on the page as an option, not a guaranteed approval.",
    aioSummary: aioSummary("Brixton"),
    nearbyAreas: [
      { name: "Herne Hill" },
      { name: "Tulse Hill" },
      { name: "Stockwell" },
      { name: "Camberwell" },
      { name: "Clapham", slug: "clapham" },
      { name: "Streatham", slug: "streatham" },
    ],
    keywords: [
      "MOT repairs Brixton",
      "failed MOT repairs Brixton",
      "MOT failure repair quote Brixton",
      "MOT repair collection Brixton",
      "car failed MOT Brixton",
    ],
  },
  {
    slug: "tooting",
    name: "Tooting",
    h1: "MOT Repairs in Tooting",
    metaTitle: metaTitle("Tooting"),
    metaDescription: metaDescription("Tooting"),
    intro:
      "Failed your MOT in Tooting? Fail2Fix helps drivers move from failed test to repaired vehicle without the usual back-and-forth. Enter your registration, tell us what failed, and we will help arrange a repair quote through a managed MOT repair process.",
    coverage:
      "This page is for drivers around Tooting Broadway, Tooting Bec and the St George's Hospital area. We also commonly help drivers from Furzedown, Earlsfield, Balham and Mitcham, subject to collection availability and workshop capacity. The service is designed for people who need a clear repair route after an MOT failure rather than a vague estimate or a long wait for a call back.",
    differentiator: DIFFERENTIATOR_TEMPLATE,
    commonRepairs: [
      "brakes and tyres from urban commuting",
      "suspension wear around traffic-calmed roads",
      "emissions and lambda faults",
      "warning lamps",
      "handbrake and rear brake efficiency issues",
    ],
    commonRepairsNote:
      "These are not fixed-price items because MOT failures vary by vehicle, parts availability and labour time. The correct process is to check the failure items, confirm the required repair, then issue a proper quotation before the vehicle is booked.",
    whyLocal:
      "A failed MOT usually creates urgency. The car may be needed for work, school runs, family commitments or commuting. Around A24, Upper Tooting Road and Garratt Lane, losing a vehicle for several days can become disruptive quickly. Fail2Fix is designed for that moment: fast contact, a direct quotation route, and a clear repair plan.",
    collectionCopy: collectionCopy("Tooting"),
    paymentAssistCopy:
      "Some MOT repairs come at the wrong time financially. Where eligible, Payment Assist can help drivers spread the cost instead of delaying safety-critical repairs. This should be presented clearly on the page as an option, not a guaranteed approval.",
    aioSummary: aioSummary("Tooting"),
    nearbyAreas: [
      { name: "Furzedown" },
      { name: "Earlsfield" },
      { name: "Balham", slug: "balham" },
      { name: "Mitcham", slug: "mitcham" },
      { name: "Wimbledon", slug: "wimbledon" },
    ],
    keywords: [
      "MOT repairs Tooting",
      "failed MOT repairs Tooting",
      "MOT failure repair quote Tooting",
      "MOT repair collection Tooting",
      "car failed MOT Tooting",
    ],
  },
  {
    slug: "balham",
    name: "Balham",
    h1: "MOT Repairs in Balham",
    metaTitle: metaTitle("Balham"),
    metaDescription: metaDescription("Balham"),
    intro:
      "Failed your MOT in Balham? Fail2Fix helps drivers move from failed test to repaired vehicle without the usual back-and-forth. Enter your registration, tell us what failed, and we will help arrange a repair quote through a managed MOT repair process.",
    coverage:
      "This page is for drivers around Balham High Road, Bedford Hill and Balham station. We also commonly help drivers from Clapham South, Wandsworth Common, Tooting Bec and Streatham Hill, subject to collection availability and workshop capacity. The service is designed for people who need a clear repair route after an MOT failure rather than a vague estimate or a long wait for a call back.",
    differentiator: DIFFERENTIATOR_TEMPLATE,
    commonRepairs: [
      "tyre defects and alignment issues",
      "brake efficiency failures",
      "suspension bushes and links",
      "lighting faults",
      "emissions problems from low-mileage cars",
    ],
    commonRepairsNote:
      "These are not fixed-price items because MOT failures vary by vehicle, parts availability and labour time. The correct process is to check the failure items, confirm the required repair, then issue a proper quotation before the vehicle is booked.",
    whyLocal:
      "A failed MOT usually creates urgency. The car may be needed for work, school runs, family commitments or commuting. Around A24 and local school-run routes, losing a vehicle for several days can become disruptive quickly. Fail2Fix is designed for that moment: fast contact, a direct quotation route, and a clear repair plan.",
    collectionCopy: collectionCopy("Balham"),
    paymentAssistCopy:
      "Some MOT repairs come at the wrong time financially. Where eligible, Payment Assist can help drivers spread the cost instead of delaying safety-critical repairs. This should be presented clearly on the page as an option, not a guaranteed approval.",
    aioSummary: aioSummary("Balham"),
    nearbyAreas: [
      { name: "Clapham South" },
      { name: "Wandsworth Common" },
      { name: "Tooting Bec", slug: "tooting" },
      { name: "Streatham Hill", slug: "streatham" },
      { name: "Clapham", slug: "clapham" },
    ],
    keywords: [
      "MOT repairs Balham",
      "failed MOT repairs Balham",
      "MOT failure repair quote Balham",
      "MOT repair collection Balham",
      "car failed MOT Balham",
    ],
  },
  {
    slug: "dulwich",
    name: "Dulwich",
    h1: "MOT Repairs in Dulwich",
    metaTitle: metaTitle("Dulwich"),
    metaDescription: metaDescription("Dulwich"),
    intro:
      "Failed your MOT in Dulwich? Fail2Fix helps drivers move from failed test to repaired vehicle without the usual back-and-forth. Enter your registration, tell us what failed, and we will help arrange a repair quote through a managed MOT repair process.",
    coverage:
      "This page is for drivers around Dulwich Village, East Dulwich and West Dulwich. We also commonly help drivers from Herne Hill, Forest Hill, Peckham Rye and Sydenham, subject to collection availability and workshop capacity. The service is designed for people who need a clear repair route after an MOT failure rather than a vague estimate or a long wait for a call back.",
    differentiator: DIFFERENTIATOR_TEMPLATE,
    commonRepairs: [
      "brake wear from school-run driving",
      "tyres and punctures",
      "suspension knocks from local roads",
      "emissions failures from short journeys",
      "wipers, washers and lighting defects",
    ],
    commonRepairsNote:
      "These are not fixed-price items because MOT failures vary by vehicle, parts availability and labour time. The correct process is to check the failure items, confirm the required repair, then issue a proper quotation before the vehicle is booked.",
    whyLocal:
      "A failed MOT usually creates urgency. The car may be needed for work, school runs, family commitments or commuting. Around South Circular, Lordship Lane and College Road, losing a vehicle for several days can become disruptive quickly. Fail2Fix is designed for that moment: fast contact, a direct quotation route, and a clear repair plan.",
    collectionCopy: collectionCopy("Dulwich"),
    paymentAssistCopy:
      "Some MOT repairs come at the wrong time financially. Where eligible, Payment Assist can help drivers spread the cost instead of delaying safety-critical repairs. This should be presented clearly on the page as an option, not a guaranteed approval.",
    aioSummary: aioSummary("Dulwich"),
    nearbyAreas: [
      { name: "Herne Hill" },
      { name: "Forest Hill" },
      { name: "Peckham Rye" },
      { name: "Sydenham" },
      { name: "Brixton", slug: "brixton" },
      { name: "Croydon", slug: "croydon" },
    ],
    keywords: [
      "MOT repairs Dulwich",
      "failed MOT repairs Dulwich",
      "MOT failure repair quote Dulwich",
      "MOT repair collection Dulwich",
      "car failed MOT Dulwich",
    ],
  },
  {
    slug: "bromley",
    name: "Bromley",
    h1: "MOT Repairs in Bromley",
    metaTitle: metaTitle("Bromley"),
    metaDescription: metaDescription("Bromley"),
    intro:
      "Failed your MOT in Bromley? Fail2Fix helps drivers move from failed test to repaired vehicle without the usual back-and-forth. Enter your registration, tell us what failed, and we will help arrange a repair quote through a managed MOT repair process.",
    coverage:
      "This page is for drivers around Bromley town centre, Bromley South and Shortlands. We also commonly help drivers from Bickley, Beckenham, Hayes and Chislehurst, subject to collection availability and workshop capacity. The service is designed for people who need a clear repair route after an MOT failure rather than a vague estimate or a long wait for a call back.",
    differentiator: DIFFERENTIATOR_TEMPLATE,
    commonRepairs: [
      "brake and suspension wear from commuter mileage",
      "tyres and alignment",
      "exhaust leaks and emissions faults",
      "steering components",
      "lights, washers and visibility items",
    ],
    commonRepairsNote:
      "These are not fixed-price items because MOT failures vary by vehicle, parts availability and labour time. The correct process is to check the failure items, confirm the required repair, then issue a proper quotation before the vehicle is booked.",
    whyLocal:
      "A failed MOT usually creates urgency. The car may be needed for work, school runs, family commitments or commuting. Around A21 and South East London commuter routes, losing a vehicle for several days can become disruptive quickly. Fail2Fix is designed for that moment: fast contact, a direct quotation route, and a clear repair plan.",
    collectionCopy: collectionCopy("Bromley"),
    paymentAssistCopy:
      "Some MOT repairs come at the wrong time financially. Where eligible, Payment Assist can help drivers spread the cost instead of delaying safety-critical repairs. This should be presented clearly on the page as an option, not a guaranteed approval.",
    aioSummary: aioSummary("Bromley"),
    nearbyAreas: [
      { name: "Bickley" },
      { name: "Beckenham" },
      { name: "Hayes" },
      { name: "Chislehurst" },
      { name: "Croydon", slug: "croydon" },
    ],
    keywords: [
      "MOT repairs Bromley",
      "failed MOT repairs Bromley",
      "MOT failure repair quote Bromley",
      "MOT repair collection Bromley",
      "car failed MOT Bromley",
    ],
  },
  {
    slug: "mitcham",
    name: "Mitcham",
    h1: "MOT Repairs in Mitcham",
    metaTitle: metaTitle("Mitcham"),
    metaDescription: metaDescription("Mitcham"),
    intro:
      "Failed your MOT in Mitcham? Fail2Fix helps drivers move from failed test to repaired vehicle without the usual back-and-forth. Enter your registration, tell us what failed, and we will help arrange a repair quote through a managed MOT repair process.",
    coverage:
      "This page is for drivers around Mitcham town centre, Figges Marsh and Pollards Hill. We also commonly help drivers from Morden, Tooting, Streatham Vale and Colliers Wood, subject to collection availability and workshop capacity. The service is designed for people who need a clear repair route after an MOT failure rather than a vague estimate or a long wait for a call back.",
    differentiator: DIFFERENTIATOR_TEMPLATE,
    commonRepairs: [
      "brake wear and imbalance",
      "tyre defects",
      "suspension bushes, links and arms",
      "emissions and engine-management faults",
      "exhaust and lighting failures",
    ],
    commonRepairsNote:
      "These are not fixed-price items because MOT failures vary by vehicle, parts availability and labour time. The correct process is to check the failure items, confirm the required repair, then issue a proper quotation before the vehicle is booked.",
    whyLocal:
      "A failed MOT usually creates urgency. The car may be needed for work, school runs, family commitments or commuting. Around A217, London Road and Commonside routes, losing a vehicle for several days can become disruptive quickly. Fail2Fix is designed for that moment: fast contact, a direct quotation route, and a clear repair plan.",
    collectionCopy: collectionCopy("Mitcham"),
    paymentAssistCopy:
      "Some MOT repairs come at the wrong time financially. Where eligible, Payment Assist can help drivers spread the cost instead of delaying safety-critical repairs. This should be presented clearly on the page as an option, not a guaranteed approval.",
    aioSummary: aioSummary("Mitcham"),
    nearbyAreas: [
      { name: "Morden" },
      { name: "Tooting", slug: "tooting" },
      { name: "Streatham Vale", slug: "streatham" },
      { name: "Colliers Wood" },
      { name: "Wimbledon", slug: "wimbledon" },
      { name: "Croydon", slug: "croydon" },
    ],
    keywords: [
      "MOT repairs Mitcham",
      "failed MOT repairs Mitcham",
      "MOT failure repair quote Mitcham",
      "MOT repair collection Mitcham",
      "car failed MOT Mitcham",
    ],
  },
];
