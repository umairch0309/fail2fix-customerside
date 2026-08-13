import { API_URL } from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

/**
 * Same-origin proxy for backend API (requests, quotes, dashboard, etc.).
 * /api/auth/* is handled by app/api/auth/[...path] (more specific).
 * Session cookies live on the customer host; without this proxy, browser
 * calls to the Render API are cross-origin and return 401.
 */
async function proxyToBackend(request: Request, context: RouteContext) {
  try {
    const { path } = await context.params;
    const incoming = new URL(request.url);
    const targetPath = path?.length ? path.join("/") : "";
    const apiBase = API_URL.replace(/\/$/, "");
    const target = `${apiBase}/api/${targetPath}${incoming.search}`;

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
    const message = error instanceof Error ? error.message : "API proxy failed";
    console.error("[api-proxy]", message, error);
    return Response.json({ error: "API_PROXY_FAILED", message }, { status: 502 });
  }
}

export async function GET(request: Request, context: RouteContext) {
  return proxyToBackend(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return proxyToBackend(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return proxyToBackend(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return proxyToBackend(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return proxyToBackend(request, context);
}

export async function OPTIONS(request: Request, context: RouteContext) {
  return proxyToBackend(request, context);
}
