import type { CatalogStatus } from "../types";
import { STATUS_LABEL } from "../utils/format";
import Badge from "./Badge";

interface StatusBadgeProps {
  status: CatalogStatus;
  showOpen?: boolean;
}

// On cards only non-open states get a badge; detail pages pass showOpen.
export default function StatusBadge({ status, showOpen = false }: StatusBadgeProps) {
  if (status === "open" && !showOpen) return null;
  const tone = status === "coming-soon" || status === "open" ? "accent" : "muted";
  return <Badge label={STATUS_LABEL[status] ?? status} tone={tone} />;
}
