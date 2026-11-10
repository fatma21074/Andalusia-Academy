import { useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { courseUrl } from "../services/catalog";
import type { CourseDetail } from "../types";
import { formatPrice } from "../utils/format";
import ApplyButton from "../components/ApplyButton";
import DetailFacts from "../components/DetailFacts";
import StatusBadge from "../components/StatusBadge";
import { ErrorState, LoadingState } from "../components/StateViews";
import PageBanner from "../components/PageBanner";
import "./DetailPage.css";

export default function CourseDetails() {
  const { id } = useParams();
  const { data: course, loading, error, reload } = useApi<CourseDetail>(id ? courseUrl(id) : null);

  return (
    <>
      <PageBanner
        title="Course Details"
        crumbs={[{ label: "Courses", to: "/courses" }, { label: course?.title ?? "Details" }]}
      />
      <section className="section">
        <div className="container">
          {loading && <LoadingState label="Loading course…" />}
          {error && <ErrorState message={error.message} onRetry={error.status === 404 ? undefined : reload} />}
          {!loading && !error && course && <CourseContent course={course} />}
        </div>
      </section>
    </>
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
          <h2 className="detail__title">{course.title}</h2>
          {course.shortDescription && <p className="detail__lead">{course.shortDescription}</p>}
          <div className="detail__actions">
            <StatusBadge status={course.status} showOpen />
            {isOpen && <ApplyButton target={{ courseId: course.id }} />}
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
