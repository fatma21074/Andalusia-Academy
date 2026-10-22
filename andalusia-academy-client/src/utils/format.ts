import type { Application, CatalogStatus } from "../types";

export function formatPrice(price: number): string {
  return price > 0 ? `${price.toLocaleString("en-US")} EGP` : "Free";
}

export function splitSkills(skills: string | null | undefined): string[] {
  return (skills ?? "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export const STATUS_LABEL: Record<CatalogStatus, string> = {
  open: "Open for enrollment",
  "coming-soon": "Coming soon",
  closed: "Closed",
  draft: "Draft",
};

// The API sends UTC timestamps without a "Z"; add it so the browser doesn't read them as local time.
export function formatDate(iso: string): string {
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(iso);
  const date = new Date(hasZone ? iso : `${iso}Z`);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function applicationTitle(application: Application): string {
  return application.courseTitle ?? application.programTitle ?? "Application";
}

// Session dates/times come as plain date/time-of-day strings — formatted separately
// from formatDate's full-timestamp handling.
export function formatSessionDate(iso: string): string {
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(iso);
  const date = new Date(hasZone ? iso : `${iso}Z`);
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function formatTime(time: string): string {
  const [hoursStr, minutesStr] = time.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  const period = hours >= 12 ? "PM" : "AM";
  const twelveHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${twelveHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}
