import { Link, useParams } from "react-router-dom";
import InstructorSessions from "../components/dashboard/InstructorSessions";
import PageBanner from "../components/PageBanner";
import { ErrorState } from "../components/StateViews";
import "../components/dashboard/Dashboard.css";

export default function InstructorSessionsPage() {
  const { courseId: rawCourseId } = useParams();
  const courseId = Number(rawCourseId);

  if (!Number.isInteger(courseId) || courseId <= 0) {
    return (
      <>
        <PageBanner
          title="Course sessions"
          crumbs={[
            { label: "Teaching", to: "/instructor" },
            { label: "Sessions" },
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
        title="Course sessions"
        crumbs={[
          { label: "Teaching", to: "/instructor" },
          { label: "Sessions" },
        ]}
      />
      <section className="section">
        <div className="container dashboard instructor-sessions-page">
          <p>
            <Link to="/instructor" className="btn btn--secondary">
              Back to Instructor Dashboard
            </Link>
          </p>
          <InstructorSessions courseId={courseId} />
        </div>
      </section>
    </>
  );
}
