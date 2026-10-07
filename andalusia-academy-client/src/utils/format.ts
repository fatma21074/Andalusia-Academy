import type { CatalogStatus } from "../types";

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
