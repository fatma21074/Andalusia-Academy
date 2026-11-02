import { Link, useParams } from "react-router-dom";
import InstructorCourseTools from "../components/dashboard/InstructorCourseTools";
import { ErrorState, EmptyState, LoadingState } from "../components/StateViews";
import PageBanner from "../components/PageBanner";
import { useApi } from "../hooks/useApi";
import { instructorCoursesUrl } from "../services/instructor";
import type { InstructorCourse } from "../types";
import "../components/dashboard/Dashboard.css";

export default function InstructorMaterialsPage() {
  const { courseId: rawCourseId } = useParams();
  const courseId = Number(rawCourseId);
  const validCourseId = Number.isInteger(courseId) && courseId > 0;
  const courses = useApi<InstructorCourse[]>(validCourseId ? instructorCoursesUrl() : null);
  const course = courses.data?.find((item) => item.courseId === courseId);
  const courseDetailsUrl = `/instructor?courseId=${courseId}#my-courses-heading`;

  if (!validCourseId) {
    return (
      <>
        <PageBanner
          title="Course Materials"
          crumbs={[
            { label: "Teaching", to: "/instructor" },
            { label: "Course materials" },
          ]}
        />
        <section className="section">
          <div className="container">
            <ErrorState message="This course ID is invalid." />
            <Link to="/instructor" className="btn btn--secondary">
              Back to Instructor Dashboard
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageBanner
        title="Course Materials"
        crumbs={[
          { label: "Teaching", to: "/instructor" },
          { label: "Course materials" },
        ]}
      />
      <section className="section">
        <div className="container dashboard">
          {courses.loading ? (
            <LoadingState label="Checking course access…" />
          ) : courses.error ? (
            <ErrorState message={courses.error.message} onRetry={courses.reload} />
          ) : !course ? (
            <EmptyState
              title="Course unavailable"
              message="This course is not assigned to your instructor account, or you don't have permission to manage it."
              action={
                <Link to="/instructor" className="btn btn--secondary">
                  Back to Instructor Dashboard
                </Link>
              }
            />
          ) : (
            <>
              <div className="dashboard__materials-card">
                <div>
                  <h2>Manage Course Materials</h2>
                  <p>View and update the learning resources for {course.title}.</p>
                </div>
                <Link to={courseDetailsUrl} className="btn btn--ghost">
                  Back to Course Details
                </Link>
              </div>
              <InstructorCourseTools courseId={courseId} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
