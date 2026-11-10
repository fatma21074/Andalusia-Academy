import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AssignmentForm from "../components/dashboard/AssignmentForm";
import StatusMessages from "../components/dashboard/StatusMessages";
import { EmptyState, ErrorState, LoadingState } from "../components/StateViews";
import PageBanner from "../components/PageBanner";
import { useApi } from "../hooks/useApi";
import { ApiError } from "../services/api";
import {
  createInstructorAssignment,
  instructorCoursesUrl,
  type AssignmentInput,
} from "../services/instructor";
import type { InstructorCourse } from "../types";
import "../components/dashboard/Dashboard.css";

export default function InstructorAssignmentCreatePage() {
  const { courseId: rawCourseId } = useParams();
  const courseId = Number(rawCourseId);
  const validCourseId = Number.isInteger(courseId) && courseId > 0;
  const courses = useApi<InstructorCourse[]>(validCourseId ? instructorCoursesUrl() : null);
  const course = courses.data?.find((item) => item.courseId === courseId);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function createAssignment(input: AssignmentInput): Promise<boolean> {
    setSaving(true);
    setError("");
    try {
      await createInstructorAssignment(courseId, input);
      navigate(`/instructor?courseId=${courseId}#submissions-heading`, {
        state: { assignmentCreated: true },
      });
      return true;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not create the assignment.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  if (!validCourseId) {
    return (
      <>
        <PageBanner
          title="Create Assignment"
          crumbs={[
            { label: "Teaching", to: "/instructor" },
            { label: "Create assignment" },
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

  const courseDetailsUrl = `/instructor?courseId=${courseId}#submissions-heading`;

  return (
    <>
      <PageBanner
        title="Create Assignment"
        crumbs={[
          { label: "Teaching", to: "/instructor" },
          { label: "Create assignment" },
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
              message="This course is not assigned to your instructor account, or you don't have permission to create assignments for it."
              action={
                <Link to="/instructor" className="btn btn--secondary">
                  Back to Instructor Dashboard
                </Link>
              }
            />
          ) : (
            <>
              <div className="dashboard__course-action">
                <div>
                  <h2>Create an assignment</h2>
                  <p>Add an assignment for {course.title}.</p>
                </div>
                <Link to={courseDetailsUrl} className="btn btn--ghost">
                  Back to Course Details
                </Link>
              </div>
              <section className="dashboard__panel" aria-labelledby="create-assignment-heading">
                <h2 id="create-assignment-heading">Assignment details</h2>
                <StatusMessages error={error} notice="" />
                <AssignmentForm submitting={saving} onSubmit={createAssignment} />
              </section>
            </>
          )}
        </div>
      </section>
    </>
  );
}
