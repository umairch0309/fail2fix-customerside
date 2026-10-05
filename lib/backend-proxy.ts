import { API_URL } from "@/lib/constants";

const PROXY_TIMEOUT_MS = 25_000;

type ProxyOptions = {
  /** Path after the backend origin, e.g. `/api` or `/api/auth` */
  apiPrefix: "/api" | "/api/auth";
  pathSegments: string[];
};

/**
 * Forward a browser request to the Fail2Fix API.
 * Encodes path segments so VRMs with spaces (SH61 MEE) do not produce an invalid URL.
 */
export async function proxyToBackend(
  request: Request,
  { apiPrefix, pathSegments }: ProxyOptions,
): Promise<Response> {
  try {
    const incoming = new URL(request.url);
    const apiBase = API_URL.replace(/\/$/, "");
    const encodedPath = pathSegments
      .filter(Boolean)
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    const prefix = apiPrefix.replace(/\/$/, "");
    const target = `${apiBase}${prefix}/${encodedPath}${incoming.search}`;

    if (!apiBase || apiBase.includes("localhost")) {
      console.error("[api-proxy] NEXT_PUBLIC_API_URL missing or localhost:", apiBase);
    }

    const headers = new Headers();
    for (const name of [
      "content-type",
      "cookie",
      "authorization",
      "user-agent",
      "accept",
      "accept-language",
    ]) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }

    // Always forward a real client IP. Without this, Render/Hostinger proxies
    // make Better Auth + Hono share one rate-limit bucket → production 429s.
    const clientIp =
      request.headers.get("cf-connecting-ip")?.trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (clientIp) {
      headers.set("cf-connecting-ip", clientIp);
      headers.set("x-real-ip", clientIp);
      headers.set("x-forwarded-for", clientIp);
    }

    const proto =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
      incoming.protocol.replace(":", "") ||
      "https";
    const host =
      request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
      request.headers.get("host") ||
      incoming.host;
    const publicOrigin = `${proto}://${host}`;

    headers.set("origin", publicOrigin);
    headers.set("x-forwarded-host", host);
    headers.set("x-forwarded-proto", proto);

    const init: RequestInit = {
      method: request.method,
      headers,
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(PROXY_TIMEOUT_MS),
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = Buffer.from(await request.arrayBuffer());
    }

    const upstream = await fetch(target, init);
    const body = await upstream.arrayBuffer();
    const responseHeaders = new Headers();

    upstream.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (
        lower === "transfer-encoding" ||
        lower === "content-encoding" ||
        lower === "content-length" ||
        lower === "set-cookie"
      ) {
        return;
      }
      responseHeaders.set(key, value);
    });

    const setCookies =
      typeof upstream.headers.getSetCookie === "function"
        ? upstream.headers.getSetCookie()
        : [];

    for (const cookie of setCookies) {
      const rewritten = cookie
        .split(";")
        .map((part) => part.trim())
        .filter((part) => !/^domain=/i.test(part))
        .join("; ");
      responseHeaders.append("set-cookie", rewritten);
    }

    return new Response(body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    const message = timedOut
      ? "The API took too long to respond. Please try again."
      : error instanceof Error
        ? error.message
        : "API proxy failed";
    console.error("[api-proxy]", message, error);
    return Response.json(
      { error: timedOut ? "API_TIMEOUT" : "API_PROXY_FAILED", message },
      { status: timedOut ? 504 : 502 },
    );
  }
}
