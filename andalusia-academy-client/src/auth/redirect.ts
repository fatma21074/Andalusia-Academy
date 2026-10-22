import type { Location } from "react-router-dom";
import type { Role } from "../types";

/** Where to go after signing in: the page the visitor was trying to open, or the fallback. */
export function redirectTarget(state: unknown, fallback: string): string {
  const from = (state as { from?: Location } | null)?.from;
  return from?.pathname ? `${from.pathname}${from.search ?? ""}` : fallback;
}

/** Where each role lands after signing in when it wasn't heading somewhere specific. */
export function defaultHome(role: Role): string {
  switch (role) {
    case "Learner":
      return "/my-courses";
    case "Instructor":
      return "/instructor";
    case "Admin":
      return "/admin";
    default:
      return "/";
  }
}
