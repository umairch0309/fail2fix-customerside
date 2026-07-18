import { API_URL } from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

/**
 * Same-origin Better Auth proxy.
 * Rewrites alone were not applying on Vercel (404 HTML). This route
 * forwards /api/auth/* to the Fail2Fix backend and rewrites Set-Cookie
 * so the session is first-party on the marketing host.
 */
async function proxyAuth(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const incoming = new URL(request.url);
  const targetPath = path?.length ? path.join("/") : "";
  const target = `${API_URL.replace(/\/$/, "")}/api/auth/${targetPath}${incoming.search}`;

  const headers = new Headers();
  const forwardHeaders = [
    "content-type",
    "cookie",
    "authorization",
    "origin",
    "user-agent",
    "accept",
    "accept-language",
  ];
  for (const name of forwardHeaders) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  // Tell Better Auth the request is coming from the marketing origin
  headers.set("origin", incoming.origin);
  headers.set("x-forwarded-host", incoming.host);
  headers.set("x-forwarded-proto", incoming.protocol.replace(":", ""));

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(target, init);
  const responseHeaders = new Headers();

  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === "transfer-encoding" || lower === "content-encoding") return;
    if (lower === "set-cookie") return; // handled below
    responseHeaders.set(key, value);
  });

  // Re-host session cookies on this domain (strip Domain=… from backend)
  const setCookies =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : upstream.headers.get("set-cookie")
        ? [upstream.headers.get("set-cookie")!]
        : [];

  for (const cookie of setCookies) {
    const rewritten = cookie
      .split(";")
      .map((part) => part.trim())
      .filter((part) => !/^domain=/i.test(part))
      .join("; ");
    responseHeaders.append("set-cookie", rewritten);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export async function GET(request: Request, context: RouteContext) {
  return proxyAuth(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return proxyAuth(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return proxyAuth(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return proxyAuth(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return proxyAuth(request, context);
}

export async function OPTIONS(request: Request, context: RouteContext) {
  return proxyAuth(request, context);
}
