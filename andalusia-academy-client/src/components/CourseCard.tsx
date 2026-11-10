import { Link } from "react-router-dom";
import type { Course } from "../types";
import { formatPrice } from "../utils/format";
import StatusBadge from "./StatusBadge";
import "./CourseCard.css";

interface CourseCardProps {
  course: Course;
}

function MetaIcon({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link to={`/courses/${course.id}`} className="course-card">
      <div className="course-card__image">
        {course.imageUrl ? (
          <img src={course.imageUrl} alt="" loading="lazy" />
        ) : (
          <div className="course-card__placeholder" aria-hidden="true">
            {course.title.charAt(0)}
          </div>
        )}
        <span className="course-card__tag">{course.categoryName}</span>
        <span className="course-card__status">
          <StatusBadge status={course.status} />
        </span>
      </div>
      <div className="course-card__body">
        <h3>{course.title}</h3>
        <p className="course-card__instructor">by {course.instructorName}</p>
        <ul className="course-card__meta">
          {course.duration && (
            <li>
              <MetaIcon path="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              {course.duration}
            </li>
          )}
          {course.location && (
            <li>
              <MetaIcon path="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              {course.location}
            </li>
          )}
        </ul>
      </div>
      <div className="course-card__fee">Course Fee - {formatPrice(course.price)}</div>
    </Link>
  );
}
