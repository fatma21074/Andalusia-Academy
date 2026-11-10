import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AssignmentPicker from "../components/dashboard/AssignmentPicker";
import AsyncView from "../components/dashboard/AsyncView";
import StatusMessages from "../components/dashboard/StatusMessages";
import StudentsTable from "../components/dashboard/StudentsTable";
import SubmissionsTable from "../components/dashboard/SubmissionsTable";
import PageBanner from "../components/PageBanner";
import StatCard from "../components/StatCard";
import { useApi } from "../hooks/useApi";
import { useNotice } from "../hooks/useNotice";
import { ApiError } from "../services/api";
import {
  gradeInstructorSubmission,
  instructorAssignmentsUrl,
  instructorCoursesUrl,
  instructorStudentsUrl,
  instructorSubmissionsUrl,
} from "../services/instructor";
import type { EnrolledStudent, InstructorAssignment, InstructorCourse, InstructorSubmission } from "../types";
import "../components/dashboard/Dashboard.css";

export default function InstructorDashboard() {
  const courses = useApi<InstructorCourse[]>(instructorCoursesUrl());
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [chosenCourse, setChosenCourse] = useState<number | null>(null);
  const [chosenAssignment, setChosenAssignment] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useNotice();

  useEffect(() => {
    const state = location.state;
    if (typeof state === "object" && state !== null && "assignmentCreated" in state && state.assignmentCreated === true) {
      setNotice("Assignment created.");
      navigate(`${location.pathname}${location.search}${location.hash}`, {
        replace: true,
        state: null,
      });
    }
  }, [location, navigate, setNotice]);

  // The open course and assignment are derived, so no effect is needed to "pick the first one".
  const requestedCourseId = Number(searchParams.get("courseId"));
  const selectedCourse =
    chosenCourse ??
    courses.data?.find((course) => course.courseId === requestedCourseId)?.courseId ??
    courses.data?.[0]?.courseId ??
    null;
  const students = useApi<EnrolledStudent[]>(selectedCourse === null ? null : instructorStudentsUrl(selectedCourse));
  const assignments = useApi<InstructorAssignment[]>(
    selectedCourse === null ? null : instructorAssignmentsUrl(selectedCourse),
  );
  const assignmentList = assignments.loading ? undefined : assignments.data;
  const selectedAssignment = chosenAssignment ?? assignmentList?.[0]?.id ?? null;
  const submissions = useApi<InstructorSubmission[]>(
    selectedAssignment === null ? null : instructorSubmissionsUrl(selectedAssignment),
  );

  function selectCourse(courseId: number) {
    setChosenCourse(courseId);
    setChosenAssignment(null);
  }

  async function run(action: () => Promise<void>, success: string, fallback: string): Promise<boolean> {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(success);
      return true;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : fallback);
      return false;
    } finally {
      setSaving(false);
    }
  }

  function grade(submissionId: number, score: number, feedback: string) {
    return run(
      async () => {
        await gradeInstructorSubmission(submissionId, { score, feedback });
        submissions.reload();
      },
      "Grade saved.",
      "Could not save the grade.",
    );
  }

  const totalStudents = courses.data?.reduce((sum, course) => sum + course.studentCount, 0);

  return (
    <>
      <PageBanner title="Instructor Dashboard" crumbs={[{ label: "Teaching" }]} />
      <section className="section">
        <div className="container dashboard">
          <StatusMessages error={error} notice={notice} />

          <div className="dashboard__stats">
            <StatCard icon="book" tone="indigo" label="My courses" value={courses.data?.length} />
            <StatCard icon="cap" tone="coral" label="Total students" value={totalStudents} />
          </div>

          <section className="dashboard__panel" aria-labelledby="my-courses-heading">
            <h2 id="my-courses-heading">My courses</h2>
            <AsyncView
              query={courses}
              loadingLabel="Loading your courses…"
              empty={{ title: "No courses yet", message: "Courses assigned to you will appear here." }}
            >
              {(list) => (
                <div className="course-picker">
                  {list.map((course) => (
                    <button
                      key={course.courseId}
                      type="button"
                      className="course-picker__item"
                      aria-pressed={course.courseId === selectedCourse}
                      onClick={() => selectCourse(course.courseId)}
                    >
                      <strong>{course.title}</strong>
                      <span>
                        {course.status} · {course.studentCount} students
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </AsyncView>
          </section>

          {selectedCourse !== null && (
            <>
              <div className="dashboard__course-actions">
                <section className="dashboard__course-action">
                  <div>
                    <h2>Assignments</h2>
                    <p>Review course assignments and student submissions, or create a new assignment.</p>
                  </div>
                  <Link
                    className="btn btn--secondary"
                    to={`/instructor/courses/${selectedCourse}/assignments/create`}
                  >
                    Create Assignment
                  </Link>
                </section>
                <section className="dashboard__course-action">
                  <div>
                    <h2>Course Materials</h2>
                    <p>View, add, or remove learning resources for this course.</p>
                  </div>
                  <Link
                    className="btn btn--secondary"
                    to={`/instructor/courses/${selectedCourse}/materials`}
                  >
                    Manage Course Materials
                  </Link>
                </section>
                <section className="dashboard__course-action">
                  <div>
                    <h2>Sessions &amp; Attendance</h2>
                    <p>Schedule course sessions and manage student attendance.</p>
                  </div>
                  <Link
                    className="btn btn--secondary"
                    to={`/instructor/courses/${selectedCourse}/sessions`}
                  >
                    Sessions &amp; Attendance
                  </Link>
                </section>
              </div>
              <section className="dashboard__panel" aria-labelledby="students-heading">
                <h2 id="students-heading">Students</h2>
                <AsyncView
                  query={students}
                  loadingLabel="Loading students…"
                  empty={{ title: "No students yet", message: "Nobody is enrolled in this course." }}
                >
                  {(list) => <StudentsTable students={list} />}
                </AsyncView>
              </section>

              <section className="dashboard__panel" aria-labelledby="submissions-heading">
                <h2 id="submissions-heading">Assignments &amp; submissions</h2>
                <AssignmentPicker
                  assignments={{
                    data: assignmentList,
                    error: assignments.error,
                    loading: assignments.loading,
                    reload: assignments.reload,
                  }}
                  selectedId={selectedAssignment}
                  onSelect={setChosenAssignment}
                />
                {selectedAssignment !== null && (
                  <AsyncView
                    query={submissions}
                    loadingLabel="Loading submissions…"
                    empty={{
                      title: "No submissions yet",
                      message: "Students' work will appear here once it is handed in.",
                    }}
                  >
                    {(list) => <SubmissionsTable submissions={list} saving={saving} onGrade={grade} />}
                  </AsyncView>
                )}
              </section>
            </>
          )}
        </div>
      </section>
    </>
  );
}
