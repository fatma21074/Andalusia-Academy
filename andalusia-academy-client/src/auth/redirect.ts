import type { Location } from "react-router-dom";

/** Where to go after signing in: the page the visitor was trying to open, or the fallback. */
export function redirectTarget(state: unknown, fallback: string): string {
  const from = (state as { from?: Location } | null)?.from;
  return from?.pathname ? `${from.pathname}${from.search ?? ""}` : fallback;
}
