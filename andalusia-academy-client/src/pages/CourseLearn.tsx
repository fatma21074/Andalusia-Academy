import { Link, useParams, useSearchParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { courseUrl } from "../services/catalog";
import { learnerCourseUrl } from "../services/learning";
import type { CourseDetail, CourseLearning } from "../types";
import Badge from "../components/Badge";
import DetailFacts from "../components/DetailFacts";
import PageBanner from "../components/PageBanner";
import { ErrorState, LoadingState } from "../components/StateViews";
import AssignmentList from "../components/learning/AssignmentList";
import AttendanceSummary from "../components/learning/AttendanceSummary";
import MaterialList from "../components/learning/MaterialList";
import ProgressBar from "../components/learning/ProgressBar";
import SessionList from "../components/learning/SessionList";
import Tabs from "../components/learning/Tabs";
import "./DetailPage.css";
import "./CourseLearn.css";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "sessions", label: "Sessions" },
  { id: "materials", label: "Materials" },
  { id: "assignments", label: "Assignments" },
  { id: "attendance", label: "Attendance & progress" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function CourseLearn() {
  const { courseId } = useParams();
  const learning = useApi<CourseLearning>(courseId ? learnerCourseUrl(courseId) : null);
  // The learning endpoint doesn't carry the course description / duration / category: the public endpoint does.
  const info = useApi<CourseDetail>(courseId ? courseUrl(courseId) : null);

  const { data: course, loading, error, reload } = learning;
  // The API answers 404 with a message when the learner isn't enrolled.
  const cannotOpen = error?.status === 404 || error?.status === 403;

  return (
    <>
      <PageBanner
        title="Course"
        crumbs={[{ label: "My courses", to: "/my-courses" }, { label: course?.title ?? "Learning" }]}
      />
      <section className="section">
        <div className="container">
          {loading && <LoadingState label="Loading your course…" />}
          {error && <ErrorState message={error.message} onRetry={cannotOpen ? undefined : reload} />}
          {cannotOpen && (
            <p className="course-learn__back">
              <Link to="/my-courses">Back to my courses</Link>
            </p>
          )}
          {!loading && !error && course && <CourseContent course={course} info={info.data} reload={reload} />}
        </div>
      </section>
    </>
  );
}

function CourseContent({ course, info, reload }: { course: CourseLearning; info?: CourseDetail; reload: () => void }) {
  const [params, setParams] = useSearchParams();
  const requested = params.get("tab");
  const active: TabId = TABS.find((t) => t.id === requested)?.id ?? "overview";
  const description = info?.fullDescription ?? info?.shortDescription;

  function changeTab(id: TabId) {
    setParams(id === "overview" ? {} : { tab: id }, { replace: true });
  }

  return (
    <>
      <header className="course-learn__header">
        <div>
          {info && <span className="detail__category">{info.categoryName}</span>}
          <h2 className="detail__title">{course.title}</h2>
          <p className="learning-muted">with {course.instructorName}</p>
        </div>
        <div className="course-learn__progress">
          <Badge label="Enrolled" tone="accent" />
          <ProgressBar percent={course.progressPercent} label="Course progress" />
        </div>
      </header>

      <Tabs tabs={[...TABS]} active={active} onChange={changeTab} label="Course sections" />

      <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`}>
        {active === "overview" && (
          <>
            <DetailFacts
              facts={[
                { label: "Duration", value: info?.duration },
                { label: "Schedule", value: course.schedule },
                { label: "Location", value: course.location },
                { label: "Instructor", value: course.instructorName },
              ]}
            />
            {description && (
              <div className="detail__block">
                <h2>About this course</h2>
                <p>{description}</p>
              </div>
            )}
          </>
        )}
        {active === "sessions" && <SessionList sessions={course.sessions} location={course.location} />}
        {active === "materials" && <MaterialList materials={course.materials} />}
        {active === "assignments" && <AssignmentList assignments={course.assignments} onSubmitted={reload} />}
        {active === "attendance" && (
          <AttendanceSummary
            progressPercent={course.progressPercent}
            sessions={course.sessions}
            assignments={course.assignments}
          />
        )}
      </div>
    </>
  );
}
