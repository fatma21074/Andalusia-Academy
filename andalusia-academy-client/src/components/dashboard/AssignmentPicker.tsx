import type { ApiError } from "../../services/api";
import type { InstructorAssignment } from "../../types";
import { formatDate } from "../../utils/format";
import FormSelect from "../FormSelect";
import AsyncView from "./AsyncView";

interface AssignmentPickerProps {
  assignments: { data?: InstructorAssignment[]; error: ApiError | null; loading: boolean; reload: () => void };
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export default function AssignmentPicker({ assignments, selectedId, onSelect }: AssignmentPickerProps) {
  return (
    <AsyncView
      query={assignments}
      loadingLabel="Loading assignments…"
      empty={{ title: "This course has no assignments yet." }}
    >
      {(list) => (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <caption className="sr-only">Assignments for this course</caption>
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Description</th>
                  <th scope="col">Due date</th>
                  <th scope="col">Submissions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((assignment) => (
                  <tr key={assignment.id}>
                    <td data-label="Title">{assignment.title}</td>
                    <td data-label="Description">{assignment.description || "—"}</td>
                    <td data-label="Due date">{assignment.dueDate ? formatDate(assignment.dueDate) : "—"}</td>
                    <td data-label="Submissions">{assignment.submissionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <FormSelect
            id="assignment-picker"
            label="Review submissions for"
            value={selectedId === null ? "" : String(selectedId)}
            options={list.map((assignment) => ({
              value: String(assignment.id),
              label: assignment.dueDate
                ? `${assignment.title} (due ${formatDate(assignment.dueDate)})`
                : assignment.title,
            }))}
            onChange={(value) => onSelect(Number(value))}
          />
        </>
      )}
    </AsyncView>
  );
}
