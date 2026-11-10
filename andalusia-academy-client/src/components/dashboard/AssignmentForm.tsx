import { useState, type FormEvent } from "react";
import { requiredProblem, onlyProblems } from "../../utils/validation";
import Button from "../Button";
import FormField from "../FormField";
import FormTextArea from "../FormTextArea";
import type { AssignmentInput } from "../../services/instructor";

interface AssignmentFormProps {
  submitting: boolean;
  onSubmit: (input: AssignmentInput) => Promise<boolean>;
}

export default function AssignmentForm({ submitting, onSubmit }: AssignmentFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const problems = onlyProblems({ title: requiredProblem(title, "Title") });
    setErrors(problems);
    if (Object.keys(problems).length > 0) return;

    const saved = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    });
    if (saved) {
      setTitle("");
      setDescription("");
      setDueDate("");
    }
  }

  return (
    <form className="dashboard-form" onSubmit={handleSubmit} noValidate>
      <FormField
        id="assignment-title"
        label="Title"
        maxLength={200}
        value={title}
        onChange={setTitle}
        error={errors.title}
      />
      <FormTextArea
        id="assignment-description"
        label="Description"
        optional
        rows={3}
        value={description}
        onChange={setDescription}
      />
      <FormField id="assignment-due" label="Due date" optional type="date" value={dueDate} onChange={setDueDate} />
      <div className="dashboard-form__actions">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating…" : "Create assignment"}
        </Button>
      </div>
    </form>
  );
}
