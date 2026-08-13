import { API_URL } from "@/lib/constants";

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  error?: { message?: string; details?: Array<{ message?: string }> };
  message?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function isPaginatedResult<T>(
  data: T[] | PaginatedResponse<T>,
): data is PaginatedResponse<T> {
  return (
    !Array.isArray(data) &&
    typeof data === "object" &&
    data !== null &&
    "items" in data &&
    "pagination" in data
  );
}

export function unwrapListData<T>(data: T[] | PaginatedResponse<T>): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "items" in data) {
    return data.items;
  }
  return [];
}

function buildQueryString(
  params?: Record<string, string | number | undefined>,
): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  // Browser: same-origin /api/* (Next proxy) so the login cookie is sent.
  // Server: call the backend URL directly.
  const apiBase = typeof window !== "undefined" ? "" : API_URL.replace(/\/$/, "");
  const response = await fetch(`${apiBase}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new ApiError("UNAUTHORIZED", 401);
    }

    let message = `Request failed (${response.status})`;
    try {
      const errorBody = (await response.json()) as ApiEnvelope<unknown>;
      const detail = errorBody.error?.details?.[0]?.message;
      message =
        detail || errorBody.error?.message || errorBody.message || message;
    } catch {
      // ignore JSON parse errors
    }
    throw new ApiError(message, response.status);
  }

  const result = (await response.json()) as ApiEnvelope<T> | T;
  if (result && typeof result === "object" && "data" in result) {
    return (result as ApiEnvelope<T>).data as T;
  }
  return result as T;
}

export function apiGet<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  return apiFetch<T>(`${path}${buildQueryString(params)}`, { method: "GET" });
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "PATCH",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function apiDelete<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: "DELETE" });
}
