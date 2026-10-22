import type { ApplicationStatus } from "../types";
import Badge from "./Badge";

const LABELS: Record<ApplicationStatus, string> = {
  pending: "Awaiting payment",
  approved: "Enrolled",
  rejected: "Rejected",
};

const TONES = { pending: "default", approved: "accent", rejected: "muted" } as const;

export default function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge label={LABELS[status] ?? status} tone={TONES[status] ?? "default"} />;
}
