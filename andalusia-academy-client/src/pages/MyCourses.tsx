import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { myCoursesUrl } from "../services/learning";
import { myApplicationsUrl } from "../services/enrollment";
import type { Application, MyCourse } from "../types";
import Alert from "../components/Alert";
import Button from "../components/Button";
import PageBanner from "../components/PageBanner";
import StatCard from "../components/StatCard";
import { EmptyState, ErrorState, LoadingState } from "../components/StateViews";
import MyCourseCard from "../components/learning/MyCourseCard";
import ProgramProgress from "../components/learning/ProgramProgress";
import "./MyCourses.css";

export default function MyCourses() {
  const courses = useApi<MyCourse[]>(myCoursesUrl());
  const applications = useApi<Application[]>(myApplicationsUrl());

  const loading = courses.loading || applications.loading;
  const error = courses.error ?? applications.error;
  const items = courses.data ?? [];
  const apps = applications.data ?? [];

  const awaitingPayment = apps.filter((a) => a.status === "pending").length;
  const programIds = [...new Set(apps.filter((a) => a.status === "approved" && a.programId).map((a) => a.programId as number))];

  const averageProgress = items.length ? Math.round(items.reduce((sum, c) => sum + c.progressPercent, 0) / items.length) : 0;
  const completed = items.filter((c) => c.status === "completed").length;

  function retry() {
    courses.reload();
    applications.reload();
  }

  return (
    <>
      <PageBanner title="My Learning" crumbs={[{ label: "My courses" }]} />
      <section className="section">
        <div className="container">
          {loading && <LoadingState label="Loading your courses…" />}
          {error && <ErrorState message={error.message} onRetry={retry} />}

          {!loading && !error && (
            <div className="my-courses">
              {awaitingPayment > 0 && (
                <Alert tone="success">
                  You have {awaitingPayment} {awaitingPayment === 1 ? "application" : "applications"} awaiting payment.{" "}
                  <Link to="/my-applications">Finish enrolling</Link>
                </Alert>
              )}

              {items.length === 0 ? (
                <EmptyState
                  title="You're not enrolled in any course yet"
                  message="Once you apply and pay, your courses show up here."
                  action={
                    <Link to="/courses">
                      <Button variant="primary">Browse courses</Button>
                    </Link>
                  }
                />
              ) : (
                <>
                  <div className="my-courses__stats">
                    <StatCard icon="book" label="Courses" value={items.length} tone="indigo" />
                    <StatCard icon="route" label="Average progress (%)" value={averageProgress} tone="violet" />
                    <StatCard icon="cap" label="Completed" value={completed} tone="teal" />
                  </div>

                  <h2>My courses</h2>
                  <div className="my-courses__grid">
                    {items.map((course) => (
                      <MyCourseCard key={course.courseId} course={course} />
                    ))}
                  </div>

                  {programIds.length > 0 && (
                    <>
                      <h2>My programs</h2>
                      <div className="my-courses__grid">
                        {programIds.map((id) => (
                          <ProgramProgress key={id} programId={id} enrollments={items} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
