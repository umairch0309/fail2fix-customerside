export interface NearbyArea {
  name: string;
  slug?: string;
}

export interface LocationPageData {
  slug: string;
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  coverage: string;
  differentiator: string;
  commonRepairs: string[];
  commonRepairsNote: string;
  whyLocal: string;
  collectionCopy: string;
  paymentAssistCopy: string;
  aioSummary: string;
  nearbyAreas: NearbyArea[];
  keywords: string[];
}

export interface LocationFaqItem {
  question: string;
  answer: string;
}
