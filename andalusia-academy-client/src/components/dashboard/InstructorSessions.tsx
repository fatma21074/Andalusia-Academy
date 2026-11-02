import { useState, type FormEvent } from "react";
import { useApi } from "../../hooks/useApi";
import { ApiError } from "../../services/api";
import {
  createInstructorSession,
  instructorSessionAttendanceUrl,
  instructorSessionsUrl,
  markInstructorAttendance,
  type CreateSessionInput,
} from "../../services/instructor";
import type {
  AttendanceStatus,
  InstructorSession,
  SessionAttendance,
  SessionStatus,
} from "../../types";
import { formatDate } from "../../utils/format";
import Button from "../Button";
import FormField from "../FormField";
import FormSelect from "../FormSelect";
import AsyncView from "./AsyncView";

const SESSION_STATUSES: { value: SessionStatus; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "live", label: "Live" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const ATTENDANCE_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
  { value: "excused", label: "Excused" },
];

function formatDuration(startTime: string, endTime: string): string {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  if (!Number.isFinite(minutes) || minutes <= 0) return "Duration unavailable";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return [
    hours > 0 ? `${hours}h` : "",
    remainingMinutes > 0 ? `${remainingMinutes}m` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

interface InstructorSessionsProps {
  courseId: number;
}

export default function InstructorSessions({
  courseId,
}: InstructorSessionsProps) {
  const sessions = useApi<InstructorSession[]>(instructorSessionsUrl(courseId));
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null,
  );
  const selectedSession = sessions.loading
    ? undefined
    : (sessions.data?.find((session) => session.id === selectedSessionId) ??
      sessions.data?.[0]);
  const attendance = useApi<SessionAttendance[]>(
    selectedSession ? instructorSessionAttendanceUrl(selectedSession.id) : null,
  );
  const [attendanceDraft, setAttendanceDraft] = useState<{
    sessionId: number | null;
    statuses: Record<number, AttendanceStatus | "">;
  }>({ sessionId: null, statuses: {} });
  const [sessionDate, setSessionDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [sessionStatus, setSessionStatus] =
    useState<SessionStatus>("scheduled");
  const [saving, setSaving] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function getDraftStatus(student: SessionAttendance): AttendanceStatus | "" {
    if (attendanceDraft.sessionId !== selectedSession?.id) {
      return student.status ?? "";
    }
    if (
      Object.prototype.hasOwnProperty.call(
        attendanceDraft.statuses,
        student.userId,
      )
    ) {
      return attendanceDraft.statuses[student.userId];
    }
    return student.status ?? "";
  }

  const changedEntries =
    attendanceDraft.sessionId === selectedSession?.id
      ? (attendance.data?.flatMap((student) => {
          const status = getDraftStatus(student);
          return status && status !== student.status
            ? [{ userId: student.userId, status }]
            : [];
        }) ?? [])
      : [];
  const hasUnsavedChanges = changedEntries.length > 0;

  function selectSession(sessionId: number) {
    if (sessionId === selectedSession?.id) return;
    if (
      hasUnsavedChanges &&
      !window.confirm(
        "You have unsaved attendance changes. Switch sessions and discard them?",
      )
    ) {
      return;
    }

    setError("");
    setNotice("");
    setAttendanceDraft({ sessionId, statuses: {} });
    setSelectedSessionId(sessionId);
  }

  async function handleSaveAttendance() {
    if (!selectedSession || changedEntries.length === 0) return;
    setSavingAttendance(true);
    setError("");
    setNotice("");
    try {
      const response = await markInstructorAttendance(
        selectedSession.id,
        changedEntries,
      );
      setNotice(response.message || "Attendance saved.");
      setAttendanceDraft({ sessionId: selectedSession.id, statuses: {} });
      attendance.reload();
      sessions.reload();
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Could not save attendance.",
      );
    } finally {
      setSavingAttendance(false);
    }
  }

  async function handleCreateSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    const startMinutes =
      Number(startTime.slice(0, 2)) * 60 + Number(startTime.slice(3, 5));
    const endMinutes =
      Number(endTime.slice(0, 2)) * 60 + Number(endTime.slice(3, 5));
    if (endMinutes <= startMinutes) {
      setError("The end time must be after the start time.");
      return;
    }

    const body: CreateSessionInput = {
      sessionDate,
      startTime,
      endTime,
      status: sessionStatus,
    };
    setSaving(true);
    try {
      const created = await createInstructorSession(courseId, body);
      setSelectedSessionId(created.id);
      setAttendanceDraft({ sessionId: created.id, statuses: {} });
      setSessionDate("");
      setStartTime("");
      setEndTime("");
      setNotice("Session scheduled.");
      sessions.reload();
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Could not create the session.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="instructor-sessions">
      {(error || notice) && (
        <p
          className={
            error
              ? "dashboard__feedback dashboard__feedback--error"
              : "dashboard__feedback"
          }
          role="status"
        >
          {error || notice}
        </p>
      )}

      <section
        className="dashboard__panel instructor-sessions__section"
        aria-labelledby="sessions-heading"
      >
        <div className="instructor-sessions__section-heading">
          <div>
            <h2 id="sessions-heading">Course sessions</h2>
            <p>Review scheduled sessions or create a new one.</p>
          </div>
        </div>
        <div className="instructor-sessions__sessions-layout">
          <div className="instructor-sessions__session-list">
            <AsyncView
              query={sessions}
              loadingLabel="Loading sessions…"
              empty={{
                title: "No sessions scheduled",
                message: "Create a session for this course below.",
              }}
            >
              {(list) => (
                <div className="instructor-sessions__session-grid">
                  {list.map((session) => {
                    const isSelected = session.id === selectedSession?.id;
                    return (
                      <article
                        key={session.id}
                        className={`instructor-sessions__session-card${isSelected ? " instructor-sessions__session-card--selected" : ""}`}
                      >
                        <div className="instructor-sessions__session-title">
                          <h3>{formatDate(session.sessionDate)}</h3>
                          <span
                            className={`instructor-sessions__status instructor-sessions__status--${session.status}`}
                          >
                            {session.status}
                          </span>
                        </div>
                        <dl className="instructor-sessions__session-details">
                          <div>
                            <dt>Time</dt>
                            <dd>
                              {session.startTime.slice(0, 5)}–
                              {session.endTime.slice(0, 5)}
                            </dd>
                          </div>
                          <div>
                            <dt>Duration</dt>
                            <dd>
                              {formatDuration(
                                session.startTime,
                                session.endTime,
                              )}
                            </dd>
                          </div>
                          <div>
                            <dt>Attendance</dt>
                            <dd>{session.markedCount} marked</dd>
                          </div>
                        </dl>
                        <Button
                          type="button"
                          variant={isSelected ? "primary" : "ghost"}
                          disabled={savingAttendance}
                          aria-pressed={isSelected}
                          className="instructor-sessions__manage-button"
                          onClick={() => selectSession(session.id)}
                        >
                          {isSelected
                            ? "Managing Attendance"
                            : "Manage Attendance"}
                        </Button>
                      </article>
                    );
                  })}
                </div>
              )}
            </AsyncView>
          </div>

          <div className="instructor-sessions__schedule">
            <form className="dashboard-form" onSubmit={handleCreateSession}>
              <div>
                <h3>Schedule a session</h3>
                <p>Add a date and time for a course meeting.</p>
              </div>
              <FormField
                id={`session-date-${courseId}`}
                label="Date"
                type="date"
                required
                value={sessionDate}
                onChange={setSessionDate}
              />
              <div className="dashboard-tools__time-fields">
                <FormField
                  id={`session-start-${courseId}`}
                  label="Start time"
                  type="time"
                  required
                  value={startTime}
                  onChange={setStartTime}
                />
                <FormField
                  id={`session-end-${courseId}`}
                  label="End time"
                  type="time"
                  required
                  value={endTime}
                  onChange={setEndTime}
                />
              </div>
              <FormSelect
                id={`session-status-${courseId}`}
                label="Status"
                value={sessionStatus}
                options={SESSION_STATUSES}
                onChange={(value) =>
                  setSessionStatus(
                    SESSION_STATUSES.find((status) => status.value === value)
                      ?.value ?? "scheduled",
                  )
                }
              />
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Create session"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section
        className="dashboard__panel instructor-sessions__section instructor-sessions__attendance-section"
        aria-labelledby="attendance-heading"
      >
        <div className="instructor-sessions__section-heading">
          <div>
            <h2 id="attendance-heading">Attendance management</h2>
            <p>Select a session above to view or update its attendance.</p>
          </div>
        </div>
        {selectedSession ? (
          <div className="instructor-sessions__attendance">
            <div className="instructor-sessions__attendance-header">
              <div>
                <span className="instructor-sessions__eyebrow">
                  Selected session
                </span>
                <h3>{formatDate(selectedSession.sessionDate)}</h3>
                <p>
                  {selectedSession.startTime.slice(0, 5)}–
                  {selectedSession.endTime.slice(0, 5)} ·{" "}
                  {formatDuration(
                    selectedSession.startTime,
                    selectedSession.endTime,
                  )}
                </p>
              </div>
              <Button
                type="button"
                disabled={
                  savingAttendance || attendance.loading || !hasUnsavedChanges
                }
                onClick={() => void handleSaveAttendance()}
              >
                {savingAttendance ? "Saving attendance…" : "Save Attendance"}
              </Button>
            </div>
            <AsyncView
              query={attendance}
              loadingLabel="Loading attendance…"
              empty={{
                title: "No enrolled students",
                message: "Attendance will appear when students enroll.",
              }}
            >
              {(list) => {
                const count = (status: AttendanceStatus) =>
                  list.filter((student) => student.status === status).length;
                const notMarked = list.filter(
                  (student) => student.status === null,
                ).length;
                const marked = list.length - notMarked;

                return (
                  <>
                    <div
                      className="attendance-summary"
                      role="group"
                      aria-label="Attendance summary"
                    >
                      <div>
                        <span>Total enrolled</span>
                        <strong>{list.length}</strong>
                      </div>
                      <div>
                        <span>Marked</span>
                        <strong>{marked}</strong>
                      </div>
                      <div>
                        <span>Present</span>
                        <strong>{count("present")}</strong>
                      </div>
                      <div>
                        <span>Absent</span>
                        <strong>{count("absent")}</strong>
                      </div>
                      <div>
                        <span>Late</span>
                        <strong>{count("late")}</strong>
                      </div>
                      <div>
                        <span>Excused</span>
                        <strong>{count("excused")}</strong>
                      </div>
                      <div>
                        <span>Not marked</span>
                        <strong>{notMarked}</strong>
                      </div>
                    </div>
                    <div className="instructor-sessions__table-section">
                      <div className="instructor-sessions__table-heading">
                        <h3>Enrolled students</h3>
                        {hasUnsavedChanges && (
                          <p className="attendance-unsaved" role="status">
                            Unsaved attendance changes
                          </p>
                        )}
                      </div>
                      <div className="table-wrap">
                        <table className="data-table instructor-sessions__attendance-table">
                          <caption className="sr-only">
                            Attendance for{" "}
                            {formatDate(selectedSession.sessionDate)}
                          </caption>
                          <colgroup>
                            <col className="instructor-sessions__student-column" />
                            <col className="instructor-sessions__status-column" />
                            <col className="instructor-sessions__id-column" />
                          </colgroup>
                          <thead>
                            <tr>
                              <th scope="col">Student</th>
                              <th scope="col">Attendance status</th>
                              <th scope="col">User ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {list.map((student) => {
                              const draftStatus = getDraftStatus(student);
                              return (
                                <tr key={student.userId}>
                                  <td data-label="Student">
                                    {student.firstName} {student.lastName}
                                  </td>
                                  <td data-label="Attendance status">
                                    <select
                                      className={`attendance-select attendance-select--${draftStatus || "unmarked"}`}
                                      value={draftStatus}
                                      disabled={savingAttendance}
                                      aria-label={`Attendance status for ${student.firstName} ${student.lastName}`}
                                      onChange={(event) => {
                                        const value = event.target.value;
                                        const status =
                                          value === ""
                                            ? ""
                                            : (ATTENDANCE_OPTIONS.find(
                                                (option) =>
                                                  option.value === value,
                                              )?.value ?? "");
                                        setAttendanceDraft((current) => ({
                                          sessionId: selectedSession.id,
                                          statuses: {
                                            ...(current.sessionId ===
                                            selectedSession.id
                                              ? current.statuses
                                              : {}),
                                            [student.userId]: status,
                                          },
                                        }));
                                      }}
                                    >
                                      <option
                                        value=""
                                        disabled={student.status !== null}
                                      >
                                        Not Marked
                                      </option>
                                      {ATTENDANCE_OPTIONS.map((option) => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td data-label="User ID">{student.userId}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                );
              }}
            </AsyncView>
          </div>
        ) : (
          <p className="instructor-sessions__empty-attendance">
            Schedule a session to begin managing attendance.
          </p>
        )}
      </section>
    </div>
  );
}
