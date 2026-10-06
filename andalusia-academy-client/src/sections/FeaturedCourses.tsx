import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { coursesUrl } from "../services/catalog";
import type { Course, PagedResult } from "../types";
import SectionHeader from "../components/SectionHeader";
import CourseCard from "../components/CourseCard";
import CardGrid from "../components/CardGrid";
import { ErrorState, LoadingState } from "../components/StateViews";

const url = coursesUrl({ status: "open", sortBy: "createdat", order: "desc", pageSize: 3 });

export default function FeaturedCourses() {
  const { data, loading, error, reload } = useApi<PagedResult<Course>>(url);

  return (
    <section className="section featured-courses">
      <div className="container">
        <SectionHeader
          title="Featured & trending courses"
          description="A snapshot of what learners are enrolling in right now."
        />
        {loading && !data && <LoadingState label="Loading courses…" />}
        {error && <ErrorState message={error.message} onRetry={reload} />}
        {data && data.data.length > 0 && (
          <>
            <CardGrid>
              {data.data.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </CardGrid>
            <p style={{ marginTop: 24 }}>
              <Link to="/courses" className="career-paths__link">
                View all courses →
              </Link>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
