import type { LocationFaqItem } from "./types";

export const LOCATION_SERVICE_STEPS = [
  "Enter your registration and basic details.",
  "Share the MOT failure items or allow the system to check available MOT information.",
  "Receive a repair quote or a call from an MOT repair specialist.",
  "Secure the booking with a small deposit where required.",
  "Use free local collection and delivery where available in your area.",
  "Pay the remaining balance once the repair is completed.",
] as const;

export const LOCATION_FAQS: LocationFaqItem[] = [
  {
    question: "How quickly can Fail2Fix arrange MOT repairs?",
    answer:
      "We aim to quote quickly once you enter your registration and MOT failure details. Booking speed depends on parts availability, repair complexity and workshop capacity.",
  },
  {
    question: "Do you offer collection and delivery?",
    answer:
      "Free local collection and delivery is available in selected areas. Coverage should be confirmed at the time of booking.",
  },
  {
    question: "Do I pay everything upfront?",
    answer:
      "A small deposit may be required to secure the booking. The balance is normally paid once the repair has been completed.",
  },
  {
    question: "Can I use Payment Assist?",
    answer:
      "Payment Assist may be available on eligible repairs, subject to acceptance and the terms offered at the time.",
  },
  {
    question: "What MOT failures can you help with?",
    answer:
      "Fail2Fix can help arrange repairs for common MOT failures such as brakes, tyres, suspension, steering, lighting, exhausts and emissions-related faults.",
  },
];

export const DIFFERENTIATOR_TEMPLATE =
  "Fail2Fix is positioned as a managed MOT repair service. That means the customer journey is built around the failed MOT result, the repair quote, booking support, collection where available, and completion of the repair. The goal is to remove friction for the driver and make the repair process feel controlled from start to finish.";

export const COMMON_REPAIRS_NOTE =
  "These are not fixed-price items because MOT failures vary by vehicle, parts availability and labour time. The correct process is to check the failure items, confirm the required repair, then issue a proper quotation before the vehicle is booked.";

export const COLLECTION_SECTION_COPY =
  "Free local collection and delivery is one of the strongest reasons to choose Fail2Fix. Where available, it removes the need to arrange lifts, taxis or time off work to move the vehicle. Availability should always be confirmed at booking because coverage depends on location, diary capacity and the repair type.";

export const PAYMENT_ASSIST_SECTION_COPY =
  "Some MOT repairs come at the wrong time financially. Where eligible, Payment Assist can help drivers spread the cost instead of delaying safety-critical repairs. This is presented as an option, not a guaranteed approval.";
