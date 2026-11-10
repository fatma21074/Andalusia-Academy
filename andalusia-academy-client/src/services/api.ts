import { UNAUTHORIZED_EVENT, clearSession, getToken } from "../auth/storage";

// Set VITE_API_BASE_URL to point the app at another API (e.g. https://api.example.com).
// Without it, `npm run dev` talks to the local API (https profile) and a production build uses the same origin.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "https://localhost:7200" : "");

export function resolveApiUrl(path: string): string {
  return new URL(path, BASE_URL || window.location.origin).toString();
}

export interface BlobResponse {
  blob: Blob;
  filename?: string;
}

function filenameFromContentDisposition(value: string | null): string | undefined {
  if (!value) return undefined;

  const encoded = value.match(/filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i)?.[1]?.trim();
  if (encoded) {
    try {
      return decodeURIComponent(encoded.replace(/^["']|["']$/g, ""));
    } catch {
      return encoded.replace(/^["']|["']$/g, "");
    }
  }

  const plain = value.match(/filename\s*=\s*(?:"([^"]+)"|([^;]+))/i);
  return (plain?.[1] ?? plain?.[2])?.trim();
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  /** Attach the JWT when there is one. Login/register turn this off. */
  authenticated?: boolean;
}

const FALLBACK_MESSAGES: Record<number, string> = {
  401: "Please sign in to continue.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
};

// The API answers errors with { message } (our controllers) or ProblemDetails { errors } (validation).
async function messageFrom(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json();
    if (data && typeof data === "object") {
      const body = data as { message?: unknown; errors?: Record<string, string[]> };
      if (typeof body.message === "string") return body.message;
      const first = body.errors ? Object.values(body.errors)[0]?.[0] : undefined;
      if (first) return first;
    }
  } catch {
    // body was empty or not JSON
  }
  return FALLBACK_MESSAGES[response.status] ?? "Something went wrong on our side. Please try again.";
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, signal, authenticated = true } = options;
  const token = authenticated ? getToken() : null;

  const headers: Record<string, string> = { Accept: "application/json" };
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (body !== undefined && !isFormData) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      signal,
      headers,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }

  if (!response.ok) {
    // A rejected token means the session is over: tell the app so it can sign out.
    if (response.status === 401 && token) {
      clearSession();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    throw new ApiError(response.status, await messageFrom(response));
  }

  return (await response.json()) as T;
}

export function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  return request<T>(path, { signal });
}

export async function getBlob(path: string): Promise<BlobResponse> {
  const url = resolveApiUrl(path);
  const apiOrigin = new URL(BASE_URL || window.location.origin).origin;
  const token = new URL(url).origin === apiOrigin ? getToken() : null;
  const headers: Record<string, string> = { Accept: "*/*" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(url, { headers });
  } catch {
    throw new ApiError(0, "Couldn't download the file. Check your connection and try again.");
  }

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearSession();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    throw new ApiError(response.status, await messageFrom(response));
  }

  const contentType = response.headers.get("Content-Type")?.toLowerCase() ?? "";
  if (contentType.includes("text/html")) {
    throw new ApiError(0, "The server returned a web page instead of the requested file.");
  }

  const blob = await response.blob();
  if (blob.size === 0) {
    throw new ApiError(0, "The downloaded file is empty.");
  }

  return {
    blob,
    filename: filenameFromContentDisposition(response.headers.get("Content-Disposition")),
  };
}

export function postJson<T>(
  path: string,
  body: unknown,
  options: Pick<RequestOptions, "authenticated" | "signal"> = {},
): Promise<T> {
  return request<T>(path, { ...options, method: "POST", body });
}

export function postForm<T>(
  path: string,
  body: FormData,
  options: Pick<RequestOptions, "authenticated" | "signal"> = {},
): Promise<T> {
  return request<T>(path, { ...options, method: "POST", body });
}

export function putJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: "PUT", body });
}

export function deleteJson<T = { message?: string }>(path: string): Promise<T> {
  return request<T>(path, { method: "DELETE" });
}
