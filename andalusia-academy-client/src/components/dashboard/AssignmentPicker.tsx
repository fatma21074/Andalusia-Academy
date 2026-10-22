import { useState, type FormEvent } from "react";
import type { ApiError } from "../../services/api";
import type { InstructorAssignment } from "../../types";
import { formatDate } from "../../utils/format";
import Button from "../Button";
import FormField from "../FormField";
import FormSelect from "../FormSelect";

interface AssignmentPickerProps {
  assignments: { data?: InstructorAssignment[]; error: ApiError | null; loading: boolean };
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

/**
 * Lists the course's assignments in a dropdown. While the backend has no "list assignments" endpoint,
 * it falls back to a typed Assignment ID so the screen keeps working.
 */
export default function AssignmentPicker({ assignments, selectedId, onSelect }: AssignmentPickerProps) {
  const [typedId, setTypedId] = useState("");

  if (assignments.data) {
    if (assignments.data.length === 0) return <p className="dashboard__muted">This course has no assignments yet.</p>;
    return (
      <FormSelect
        id="assignment-picker"
        label="Assignment"
        value={selectedId === null ? "" : String(selectedId)}
        options={assignments.data.map((a) => ({
          value: String(a.id),
          label: a.dueDate ? `${a.title} (due ${formatDate(a.dueDate)})` : a.title,
        }))}
        onChange={(value) => onSelect(Number(value))}
      />
    );
  }

  if (assignments.loading) return <p className="dashboard__muted">Loading assignments…</p>;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const id = Number(typedId);
    if (Number.isInteger(id) && id > 0) onSelect(id);
  }

  return (
    <form className="dashboard-form dashboard-form--inline" onSubmit={handleSubmit}>
      <FormField id="assignment-id" label="Assignment ID" type="number" min={1} value={typedId} onChange={setTypedId} />
      <Button type="submit" variant="secondary">
        Load submissions
      </Button>
    </form>
  );
}
