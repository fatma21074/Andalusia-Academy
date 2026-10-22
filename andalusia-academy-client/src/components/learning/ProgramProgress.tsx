import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { programUrl } from "../../services/catalog";
import type { MyCourse, ProgramDetail } from "../../types";
import Badge from "../Badge";
import { LoadingState } from "../StateViews";
import ProgressBar from "./ProgressBar";
import "./learning.css";

interface ProgramProgressProps {
  programId: number;
  enrollments: MyCourse[];
}

// A program's progress is the average progress of its courses.
export default function ProgramProgress({ programId, enrollments }: ProgramProgressProps) {
  const { data: program, loading, error } = useApi<ProgramDetail>(programUrl(programId));

  if (loading) return <LoadingState label="Loading program…" />;
  if (error || !program) return null;

  const courses = program.includedCourses.map((course) => ({
    course,
    enrollment: enrollments.find((e) => e.courseId === course.id),
  }));
  const average =
    courses.length === 0
      ? 0
      : courses.reduce((sum, { enrollment }) => sum + (enrollment?.progressPercent ?? 0), 0) / courses.length;

  return (
    <article className="enrollment-card">
      <div className="enrollment-card__top">
        <Badge label="Program" tone="default" />
        <h3>
          <Link to={`/programs/${program.id}`}>{program.title}</Link>
        </h3>
        <p className="learning-muted">
          {courses.length} {courses.length === 1 ? "course" : "courses"}
        </p>
      </div>
      <ProgressBar percent={average} label={`${program.title} progress`} />
      <ul className="program-courses">
        {courses.map(({ course, enrollment }) => (
          <li key={course.id}>
            {enrollment ? <Link to={`/learn/${course.id}`}>{course.title}</Link> : course.title}
            <span className="learning-muted">{enrollment ? `${enrollment.progressPercent}%` : "Not available yet"}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
