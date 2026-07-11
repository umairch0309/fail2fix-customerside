// Google Analytics / Google Ads gtag.js type declarations

interface GtagEventParams {
  send_to?: string;
  value?: number;
  currency?: string;
  event_callback?: () => void;
  [key: string]: unknown;
}

interface Window {
  dataLayer: unknown[];
  gtag: (
    command: "js" | "config" | "event" | "set" | "consent",
    targetIdOrDate: string | Date,
    params?: GtagEventParams | string
  ) => void;
}
