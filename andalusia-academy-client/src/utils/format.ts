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

export function formatSessionDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatTime(value: string): string {
  // ASP.NET TimeSpan is usually serialized as HH:mm:ss; accept HH:mm too.
  const match = /^(\d{1,2}):(\d{2})/.exec(value);
  if (!match) return value;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
