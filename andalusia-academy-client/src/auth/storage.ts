import type { AuthSession } from "../types";

const STORAGE_KEY = "andalusia.session";

// Fired by the API layer when the server rejects our token (expired / invalid).
export const UNAUTHORIZED_EVENT = "auth:unauthorized";

/** Reads the `exp` claim (ms since epoch) from a JWT, or null if it can't be read. */
export function getTokenExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(payload)) as { exp?: number };
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
}

function isExpired(token: string): boolean {
  const expiry = getTokenExpiry(token);
  return expiry !== null && expiry <= Date.now();
}

export function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (!session.token || isExpired(session.token)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage can be unavailable (private mode); the session then lasts until the tab closes.
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function getToken(): string | null {
  return loadSession()?.token ?? null;
}
