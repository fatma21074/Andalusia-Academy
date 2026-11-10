import type { SessionInfo } from "../../types";
import { formatSessionDate, formatTime } from "../../utils/format";
import { AttendanceBadge, SessionStatusBadge } from "./AttendanceBadge";
import "./learning.css";

interface SessionListProps {
  sessions: SessionInfo[];
  location: string | null;
}

export default function SessionList({ sessions, location }: SessionListProps) {
  const ordered = [...sessions].sort((a, b) => a.sessionDate.localeCompare(b.sessionDate));
  const upcoming = ordered.filter((s) => s.status === "scheduled" || s.status === "live");
  const past = ordered.filter((s) => s.status === "completed" || s.status === "cancelled").reverse();

  if (sessions.length === 0) {
    return <p className="learning-muted">No sessions have been scheduled yet.</p>;
  }

  return (
    <div className="session-groups">
      {upcoming.length > 0 && <SessionGroup title="Upcoming" sessions={upcoming} location={location} />}
      {past.length > 0 && <SessionGroup title="Past" sessions={past} location={location} showAttendance />}
    </div>
  );
}

function SessionGroup({
  title,
  sessions,
  location,
  showAttendance = false,
}: SessionListProps & { title: string; showAttendance?: boolean }) {
  return (
    <section>
      <h3>{title}</h3>
      <ul className="session-list">
        {sessions.map((session) => (
          <li key={session.id} className="session-list__item">
            <div className="session-list__date">
              <strong>{formatSessionDate(session.sessionDate)}</strong>
              <span>
                {formatTime(session.startTime)} to {formatTime(session.endTime)}
              </span>
            </div>
            {location && <span className="session-list__location">{location}</span>}
            <div className="session-list__badges">
              <SessionStatusBadge status={session.status} />
              {showAttendance && session.status === "completed" && (
                <AttendanceBadge status={session.myAttendanceStatus} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
