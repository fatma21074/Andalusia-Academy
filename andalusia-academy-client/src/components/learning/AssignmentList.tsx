import { useState, type FormEvent } from "react";
import { ApiError } from "../../services/api";
import { submitAssignment } from "../../services/learning";
import type { AssignmentInfo } from "../../types";
import { formatDate } from "../../utils/format";
import Alert from "../Alert";
import Badge from "../Badge";
import Button from "../Button";
import FormField from "../FormField";
import "./learning.css";

interface AssignmentListProps {
  assignments: AssignmentInfo[];
  /** Called after a successful submission so the page can reload its data. */
  onSubmitted: () => void;
}

export default function AssignmentList({ assignments, onSubmitted }: AssignmentListProps) {
  if (assignments.length === 0) return <p className="learning-muted">No assignments yet.</p>;

  return (
    <ul className="assignment-list">
      {assignments.map((assignment) => (
        <AssignmentCard key={assignment.id} assignment={assignment} onSubmitted={onSubmitted} />
      ))}
    </ul>
  );
}

function AssignmentCard({ assignment, onSubmitted }: { assignment: AssignmentInfo; onSubmitted: () => void }) {
  const status = assignment.mySubmissionStatus;
  const [now] = useState(() => Date.now()); // fixed for this render pass: render must stay pure
  const overdue = !status && assignment.dueDate !== null && new Date(assignment.dueDate).getTime() < now;

  return (
    <li className="assignment">
      <div className="assignment__header">
        <h3>{assignment.title}</h3>
        {status === "graded" ? (
          <Badge label="Graded" tone="accent" />
        ) : status === "submitted" ? (
          <Badge label="Submitted" tone="default" />
        ) : overdue ? (
          <Badge label="Overdue" tone="muted" />
        ) : (
          <Badge label="To do" tone="default" />
        )}
      </div>
      {assignment.description && <p>{assignment.description}</p>}
      {assignment.dueDate && <p className="learning-muted">Due {formatDate(assignment.dueDate)}</p>}

      {status === "graded" && (
        <div className="assignment__submission">
          <div className="assignment__grade">
            <strong>Score: {assignment.myScore}</strong>
          </div>
        </div>
      )}
      {status === "submitted" && (
        <div className="assignment__submission">
          <p>Your work was submitted and is waiting for your instructor's review.</p>
        </div>
      )}

      {!status && <SubmitForm assignmentId={assignment.id} onSubmitted={onSubmitted} />}
    </li>
  );
}

function SubmitForm({ assignmentId, onSubmitted }: { assignmentId: number; onSubmitted: () => void }) {
  const [link, setLink] = useState("");
  const [fieldError, setFieldError] = useState<string>();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^https?:\/\/\S+$/i.test(link.trim())) {
      setFieldError("Enter a link starting with http:// or https://.");
      return;
    }
    setFieldError(undefined);
    setSubmitting(true);
    setFormError(null);
    try {
      await submitAssignment(assignmentId, link.trim());
      onSubmitted();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="assignment__form" onSubmit={handleSubmit} noValidate>
      {formError && <Alert tone="error">{formError}</Alert>}
      <FormField
        id={`submission-${assignmentId}`}
        label="Link to your work"
        type="url"
        placeholder="https://github.com/you/project"
        value={link}
        onChange={setLink}
        error={fieldError}
      />
      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit assignment"}
      </Button>
    </form>
  );
}
