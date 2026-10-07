import { Link } from "react-router-dom";
import type { Course } from "../types";
import { formatPrice } from "../utils/format";
import Card from "./Card";
import StatusBadge from "./StatusBadge";
import "./CourseCard.css";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link to={`/courses/${course.id}`} className="course-card-link">
      <Card className="course-card">
        <div className="course-card__image-wrap">
          {course.imageUrl ? (
            <img src={course.imageUrl} alt="" className="course-card__image" loading="lazy" />
          ) : (
            <div className="course-card__placeholder" aria-hidden="true">
              {course.title.charAt(0)}
            </div>
          )}
          <StatusBadge status={course.status} />
        </div>
        <span className="course-card__category">{course.categoryName}</span>
        <h3 className="course-card__title">{course.title}</h3>
        {course.shortDescription && <p className="course-card__description">{course.shortDescription}</p>}
        <div className="course-card__meta">
          <span>{course.duration}</span>
          <span className="course-card__price">{formatPrice(course.price)}</span>
        </div>
      </Card>
    </Link>
  );
}
