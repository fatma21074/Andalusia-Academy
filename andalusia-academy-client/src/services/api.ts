// Empty by default: requests go to the same origin and Vite proxies /api in dev.
// For a deployed build, set VITE_API_BASE_URL (e.g. https://api.example.com).
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      signal,
      headers: { Accept: "application/json" },
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      response.status === 404
        ? "We couldn't find what you were looking for."
        : "Something went wrong on our side. Please try again.",
    );
  }

  return (await response.json()) as T;
}
