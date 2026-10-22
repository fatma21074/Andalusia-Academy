import type { EnrolledStudent } from "../../types";
import { formatDate } from "../../utils/format";

export default function StudentsTable({ students }: { students: EnrolledStudent[] }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <caption className="sr-only">Students enrolled in the selected course</caption>
        <thead>
          <tr>
            <th scope="col">Student</th>
            <th scope="col">Email</th>
            <th scope="col">Enrolled</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.userId}>
              <td data-label="Student">
                {student.firstName} {student.lastName}
              </td>
              <td data-label="Email">{student.email}</td>
              <td data-label="Enrolled">{formatDate(student.enrolledAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
