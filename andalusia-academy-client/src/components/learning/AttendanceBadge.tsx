import type { AttendanceStatus, SessionStatus } from "../../types";
import Badge from "../Badge";

const ATTENDANCE_LABEL: Record<AttendanceStatus, string> = {
  present: "Present",
  late: "Late",
  absent: "Absent",
  excused: "Excused",
};

const ATTENDANCE_TONE = { present: "accent", late: "default", absent: "muted", excused: "muted" } as const;

export function AttendanceBadge({ status }: { status: AttendanceStatus | null }) {
  if (!status) return <span className="learning-muted">Not marked</span>;
  return <Badge label={ATTENDANCE_LABEL[status]} tone={ATTENDANCE_TONE[status]} />;
}

const SESSION_LABEL: Record<SessionStatus, string> = {
  scheduled: "Scheduled",
  live: "Live now",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function SessionStatusBadge({ status }: { status: SessionStatus }) {
  return (
    <Badge
      label={SESSION_LABEL[status]}
      tone={status === "live" ? "accent" : status === "scheduled" ? "default" : "muted"}
    />
  );
}
