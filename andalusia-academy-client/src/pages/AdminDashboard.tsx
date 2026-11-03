import { useState } from "react";
import { Link } from "react-router-dom";
import AsyncView from "../components/dashboard/AsyncView";
import CourseForm from "../components/dashboard/CourseForm";
import CoursesTable from "../components/dashboard/CoursesTable";
import StatusMessages from "../components/dashboard/StatusMessages";
import UsersTable from "../components/dashboard/UsersTable";
import PageBanner from "../components/PageBanner";
import Pagination from "../components/Pagination";
import SelectField from "../components/SelectField";
import StatCard from "../components/StatCard";
import FormField from "../components/FormField";
import { useApi } from "../hooks/useApi";
import { useNotice } from "../hooks/useNotice";
import {
  adminInstructorsUrl,
  adminUsersUrl,
  COURSE_STATUSES,
  createAdminCourse,
  deleteAdminCourse,
  updateAdminCourse,
  type CourseAdminInput,
} from "../services/admin";
import { ApiError, getJson } from "../services/api";
import { categoriesUrl, courseUrl, coursesUrl } from "../services/catalog";
import type {
  AdminInstructor,
  AdminUser,
  Category,
  Course,
  CourseDetail,
  PagedResult,
} from "../types";
import "../components/dashboard/Dashboard.css";

const PAGE_SIZE = 10;
const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  ...COURSE_STATUSES,
];

export default function AdminDashboard() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [editing, setEditing] = useState<CourseDetail | undefined>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useNotice();
  const [instructorSearch, setInstructorSearch] = useState("");

  const users = useApi<AdminUser[]>(adminUsersUrl());
  const categories = useApi<Category[]>(categoriesUrl());
  const instructors = useApi<AdminInstructor[]>(adminInstructorsUrl());
  const courses = useApi<PagedResult<Course>>(
    coursesUrl({
      page,
      pageSize: PAGE_SIZE,
      status: statusFilter || undefined,
    }),
  );

  function changeFilter(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  async function run(
    action: () => Promise<void>,
    success: string,
    fallback: string,
  ): Promise<boolean> {
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

  function saveCourse(input: CourseAdminInput) {
    const course = editing;
    return run(
      async () => {
        if (course) await updateAdminCourse(course.id, input);
        else await createAdminCourse(input);
        setEditing(undefined);
        courses.reload();
      },
      course ? "Course updated." : "Course created as a draft.",
      course ? "Could not update the course." : "Could not create the course.",
    );
  }

  function removeCourse(course: Course) {
    void run(
      async () => {
        await deleteAdminCourse(course.id);
        courses.reload();
      },
      "Course deleted.",
      "Could not delete the course.",
    );
  }

  async function startEditing(course: Course) {
    setError("");
    setNotice("");
    try {
      setEditing(await getJson<CourseDetail>(courseUrl(course.id)));
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Could not load the course.",
      );
    }
  }

  const instructorCount = users.data?.filter(
    (user) => user.role === "Instructor",
  ).length;
  const normalizedInstructorSearch = instructorSearch.trim().toLocaleLowerCase();
  const visibleInstructors = instructors.data?.filter((instructor) =>
    `${instructor.instructorId} ${instructor.userId} ${instructor.firstName} ${instructor.lastName} ${instructor.email} ${instructor.specialization ?? ""}`
      .toLocaleLowerCase()
      .includes(normalizedInstructorSearch),
  );

  return (
    <>
      <PageBanner
        title="Admin Dashboard"
        crumbs={[{ label: "Administration" }]}
      />
      <section className="section">
        <div className="container dashboard">
          <StatusMessages error={error} notice={notice} />

          <p>
            <Link to="/admin/content" className="btn btn--secondary">
              Manage website content
            </Link>
          </p>

          <div className="dashboard__stats">
            <StatCard
              icon="grid"
              tone="indigo"
              label="Registered users"
              value={users.data?.length}
            />
            <StatCard
              icon="cap"
              tone="teal"
              label="Instructors"
              value={instructorCount}
            />
            <StatCard
              icon="book"
              tone="coral"
              label="Courses in catalog"
              value={courses.data?.totalCount}
            />
          </div>

          <section
            className="dashboard__panel"
            aria-labelledby="course-form-heading"
          >
            <h2 id="course-form-heading">
              {editing ? `Edit “${editing.title}”` : "Create course"}
            </h2>
            <AsyncView
              query={categories}
              loadingLabel="Loading categories…"
              empty={{
                title: "No categories",
                message: "Add a category before creating courses.",
              }}
            >
              {(list) => (
                <AsyncView
                  query={instructors}
                  loadingLabel="Loading instructors…"
                  empty={{
                    title: "No instructors available",
                    message: "Add an instructor account before creating or assigning courses.",
                  }}
                >
                  {(instructorList) => (
                    <CourseForm
                      key={editing?.id ?? "new"}
                      categories={list}
                      instructors={instructorList}
                      course={editing}
                      submitting={saving}
                      onSubmit={saveCourse}
                      onCancel={editing ? () => setEditing(undefined) : undefined}
                    />
                  )}
                </AsyncView>
              )}
            </AsyncView>
          </section>

          <section className="dashboard__panel" aria-labelledby="instructors-heading">
            <h2 id="instructors-heading">Instructors</h2>
            <FormField
              id="instructor-search"
              label="Search instructors"
              type="search"
              value={instructorSearch}
              onChange={setInstructorSearch}
              placeholder="Name, email, or ID"
            />
            <AsyncView
              query={instructors}
              loadingLabel="Loading instructors…"
              empty={{ title: "No instructors found", message: "Instructor accounts will appear here." }}
              isEmpty={(list) => list.length === 0}
            >
              {(list) =>
                visibleInstructors?.length === 0 ? (
                  <p className="dashboard__muted">No instructors match your search.</p>
                ) : (
                  <div className="table-wrap">
                    <table className="data-table">
                      <caption className="sr-only">Instructor accounts</caption>
                      <thead>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Specialization</th>
                          <th scope="col">Instructor ID</th>
                          <th scope="col">User ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(visibleInstructors ?? list).map((instructor) => (
                          <tr key={instructor.instructorId}>
                            <td data-label="Name">{instructor.firstName} {instructor.lastName}</td>
                            <td data-label="Email">{instructor.email}</td>
                            <td data-label="Specialization">{instructor.specialization ?? "—"}</td>
                            <td data-label="Instructor ID">{instructor.instructorId}</td>
                            <td data-label="User ID">{instructor.userId}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }
            </AsyncView>
          </section>

          <section
            className="dashboard__panel"
            aria-labelledby="courses-heading"
          >
            <h2 id="courses-heading">Manage courses</h2>
            <div className="dashboard__filters">
              <SelectField
                label="Status"
                value={statusFilter}
                options={STATUS_OPTIONS}
                onChange={changeFilter}
              />
            </div>
            <AsyncView
              query={courses}
              loadingLabel="Loading courses…"
              isEmpty={(result) => result.data.length === 0}
              empty={{
                title: "No courses found",
                message: "Try a different status filter.",
              }}
            >
              {(result) => (
                <>
                  <CoursesTable
                    courses={result.data}
                    busy={saving}
                    onEdit={startEditing}
                    onDelete={removeCourse}
                  />
                  <Pagination
                    page={result.page}
                    totalPages={result.totalPages}
                    onChange={setPage}
                  />
                </>
              )}
            </AsyncView>
          </section>

          <section className="dashboard__panel" aria-labelledby="users-heading">
            <h2 id="users-heading">Users</h2>
            <AsyncView
              query={users}
              loadingLabel="Loading users…"
              empty={{ title: "No users yet" }}
            >
              {(list) => <UsersTable users={list} />}
            </AsyncView>
          </section>
        </div>
      </section>
    </>
  );
}
