import { WS_URL } from "@/lib/constants";

/**
 * Fetch a short-lived WS ticket via the same-origin /api proxy
 * (session cookie is first-party there; the Render API never sees it).
 */
export async function fetchWsTicket(): Promise<string | null> {
  const response = await fetch("/api/ws/ticket", { credentials: "include" });
  if (response.status === 401) return null;
  if (!response.ok) {
    throw new Error(`WS ticket failed (${response.status})`);
  }
  const body = (await response.json()) as {
    data?: { ticket?: string };
    ticket?: string;
  };
  return body.data?.ticket || body.ticket || null;
}

export function buildAuthenticatedWsUrl(ticket: string): string {
  const joiner = WS_URL.includes("?") ? "&" : "?";
  return `${WS_URL}${joiner}ticket=${encodeURIComponent(ticket)}`;
}
