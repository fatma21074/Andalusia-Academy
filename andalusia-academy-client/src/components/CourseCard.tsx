import type { Course } from "../types";
import Card from "./Card";
import Badge from "./Badge";
import "./CourseCard.css";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="course-card">
      <div className="course-card__image-wrap">
        <img src={course.image} alt={course.title} className="course-card__image" />
        {course.status === "coming-soon" && <Badge label="Coming soon" tone="accent" />}
      </div>
      <span className="course-card__category">{course.category}</span>
      <h3 className="course-card__title">{course.title}</h3>
      <div className="course-card__meta">
        <span>{course.duration}</span>
        <span className="course-card__price">{course.price.toLocaleString()} EGP</span>
      </div>
    </Card>
  );
}
