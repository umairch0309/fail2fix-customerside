export function trackPhoneClick(source?: string) {
  if (typeof window === "undefined") return;

  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void })
    .gtag;
  if (!gtag) return;

  gtag("event", "phone_click", {
    event_category: "engagement",
    event_label: source ?? "tel_link",
  });
}
