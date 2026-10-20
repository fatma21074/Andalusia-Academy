import type { AssignmentInfo, AttendanceStatus, SessionInfo } from "../../types";
import { formatSessionDate, formatTime } from "../../utils/format";
import { AttendanceBadge } from "./AttendanceBadge";
import ProgressBar from "./ProgressBar";
import "./learning.css";

interface AttendanceSummaryProps {
  progressPercent: number;
  sessions: SessionInfo[];
  assignments: AssignmentInfo[];
}

const STATUS_ORDER: { status: AttendanceStatus; label: string }[] = [
  { status: "present", label: "Present" },
  { status: "late", label: "Late" },
  { status: "absent", label: "Absent" },
  { status: "excused", label: "Excused" },
];

export default function AttendanceSummary({ progressPercent, sessions, assignments }: AttendanceSummaryProps) {
  const completed = sessions
    .filter((s) => s.status === "completed")
    .sort((a, b) => b.sessionDate.localeCompare(a.sessionDate));
  const submitted = assignments.filter((a) => a.mySubmissionStatus !== null).length;

  return (
    <div className="attendance">
      <div className="progress-breakdown">
        <h3>Your progress</h3>
        <ProgressBar percent={progressPercent} label="Course progress" />
        <ul>
          <li>
            Assignments submitted: <strong>{submitted}</strong> of {assignments.length}
          </li>
          {STATUS_ORDER.map(({ status, label }) => {
            const count = completed.filter((s) => s.myAttendanceStatus === status).length;
            return count > 0 ? (
              <li key={status}>
                {label}: <strong>{count}</strong> {count === 1 ? "session" : "sessions"}
              </li>
            ) : null;
          })}
        </ul>
      </div>

      <h3>Attendance record</h3>
      {completed.length === 0 ? (
        <p className="learning-muted">Attendance appears here after your first session.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Session</th>
              <th scope="col">Time</th>
              <th scope="col">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {completed.map((session) => (
              <tr key={session.id}>
                <td data-label="Session">{formatSessionDate(session.sessionDate)}</td>
                <td data-label="Time">
                  {formatTime(session.startTime)} to {formatTime(session.endTime)}
                </td>
                <td data-label="Attendance">
                  <AttendanceBadge status={session.myAttendanceStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
