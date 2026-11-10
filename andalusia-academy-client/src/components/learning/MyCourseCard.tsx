import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { learnerCourseUrl } from "../../services/learning";
import type { CourseLearning, MyCourse } from "../../types";
import { formatDate, formatSessionDate, formatTime } from "../../utils/format";
import Badge from "../Badge";
import ProgressBar from "./ProgressBar";
import "./learning.css";

// /my-courses only returns the basics, so the card loads the course's learning data for the extras
// (instructor, next session, open assignments). If that fails the card still works without them.
export default function MyCourseCard({ course }: { course: MyCourse }) {
  const { data: learning } = useApi<CourseLearning>(learnerCourseUrl(course.courseId));

  return (
    <article className="enrollment-card">
      <div className="enrollment-card__top">
        <Badge label={course.status === "completed" ? "Completed" : "Enrolled"} tone="accent" />
        <h3>{course.title}</h3>
        <p className="learning-muted">
          {learning ? `with ${learning.instructorName} · ` : ""}Enrolled {formatDate(course.enrolledAt)}
        </p>
      </div>
      <ProgressBar percent={course.progressPercent} label={`${course.title} progress`} />
      {learning && <Highlights learning={learning} />}
      <Link to={`/learn/${course.courseId}`} className="btn btn--primary">
        Continue learning
        <span className="sr-only"> {course.title}</span>
      </Link>
    </article>
  );
}

function Highlights({ learning }: { learning: CourseLearning }) {
  const next = learning.sessions.find((s) => s.status === "scheduled" || s.status === "live");
  const toSubmit = learning.assignments.filter((a) => a.mySubmissionStatus === null).length;

  return (
    <ul className="enrollment-card__highlights">
      <li>
        {next ? (
          <>
            <strong>Next session:</strong> {formatSessionDate(next.sessionDate)}, {formatTime(next.startTime)}
            {learning.location && ` · ${learning.location}`}
          </>
        ) : (
          "No upcoming sessions"
        )}
      </li>
      {toSubmit > 0 && (
        <li>
          <strong>{toSubmit}</strong> {toSubmit === 1 ? "assignment" : "assignments"} to submit
        </li>
      )}
    </ul>
  );
}
