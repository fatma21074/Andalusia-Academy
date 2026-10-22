import { useState } from "react";
import type { Course } from "../../types";
import Button from "../Button";

interface CoursesTableProps {
  courses: Course[];
  busy: boolean;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export default function CoursesTable({ courses, busy, onEdit, onDelete }: CoursesTableProps) {
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  return (
    <div className="table-wrap">
      <table className="data-table">
        <caption className="sr-only">Courses in the catalog</caption>
        <thead>
          <tr>
            <th scope="col">Course</th>
            <th scope="col">Category</th>
            <th scope="col">Instructor</th>
            <th scope="col">Price</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td data-label="Course">
                {course.title}
                <small className="cell-note">ID: {course.id}</small>
              </td>
              <td data-label="Category">{course.categoryName}</td>
              <td data-label="Instructor">{course.instructorName}</td>
              <td data-label="Price">{course.price.toLocaleString()}</td>
              <td data-label="Status">{course.status}</td>
              <td data-label="Actions">
                {confirmingId === course.id ? (
                  <div className="dashboard__actions" role="group" aria-label={`Confirm deleting ${course.title}`}>
                    <Button
                      variant="secondary"
                      disabled={busy}
                      onClick={() => {
                        setConfirmingId(null);
                        onDelete(course);
                      }}
                    >
                      Confirm delete
                    </Button>
                    <Button variant="ghost" onClick={() => setConfirmingId(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="dashboard__actions">
                    <Button variant="secondary" disabled={busy} onClick={() => onEdit(course)}>
                      Edit
                    </Button>
                    <Button variant="secondary" disabled={busy} onClick={() => setConfirmingId(course.id)}>
                      Delete
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
