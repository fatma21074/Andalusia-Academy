import { Link, useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { courseUrl } from "../services/catalog";
import type { CourseDetail } from "../types";
import { formatPrice } from "../utils/format";
import Button from "../components/Button";
import DetailFacts from "../components/DetailFacts";
import StatusBadge from "../components/StatusBadge";
import { ErrorState, LoadingState } from "../components/StateViews";
import "./DetailPage.css";

export default function CourseDetails() {
  const { id } = useParams();
  const { data: course, loading, error, reload } = useApi<CourseDetail>(id ? courseUrl(id) : null);

  return (
    <section className="section">
      <div className="container">
        <Link to="/courses" className="detail__back">
          ← All courses
        </Link>

        {loading && <LoadingState label="Loading course…" />}
        {error && <ErrorState message={error.message} onRetry={error.status === 404 ? undefined : reload} />}
        {!loading && !error && course && <CourseContent course={course} />}
      </div>
    </section>
  );
}

function CourseContent({ course }: { course: CourseDetail }) {
  const isOpen = course.status === "open";

  return (
    <>
      <div className={`detail__header ${course.imageUrl ? "" : "detail__header--no-image"}`}>
        {course.imageUrl && (
          <div className="detail__image-wrap">
            <img src={course.imageUrl} alt="" className="detail__image" />
          </div>
        )}
        <div>
          <span className="detail__category">{course.categoryName}</span>
          <h1 className="detail__title">{course.title}</h1>
          {course.shortDescription && <p className="detail__lead">{course.shortDescription}</p>}
          <div className="detail__actions">
            <StatusBadge status={course.status} showOpen />
            {/* Sprint 3 replaces this with the real application flow. */}
            {isOpen && (
              <Link to="/contact">
                <Button variant="primary">Contact admissions to enroll</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <DetailFacts
        facts={[
          { label: "Price", value: formatPrice(course.price) },
          { label: "Duration", value: course.duration },
          { label: "Schedule", value: course.schedule },
          { label: "Location", value: course.location },
          { label: "Instructor", value: course.instructorName },
          { label: "Type", value: course.type },
        ]}
      />

      {course.fullDescription && (
        <div className="detail__block">
          <h2>About this course</h2>
          <p>{course.fullDescription}</p>
        </div>
      )}
    </>
  );
}
