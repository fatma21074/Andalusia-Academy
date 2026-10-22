import { useState, type FormEvent } from "react";
import type { InstructorSubmission } from "../../types";
import Button from "../Button";
import FormField from "../FormField";
import FormTextArea from "../FormTextArea";

interface GradeFormProps {
  submission: InstructorSubmission;
  saving: boolean;
  onSave: (score: number, feedback: string) => void;
  onCancel: () => void;
}

function scoreProblem(text: string): string | null {
  if (!text.trim()) return "Score is required.";
  const score = Number(text);
  if (!Number.isInteger(score) || score < 0 || score > 100) return "Enter a whole number from 0 to 100.";
  return null;
}

export default function GradeForm({ submission, saving, onSave, onCancel }: GradeFormProps) {
  const [score, setScore] = useState(submission.score === null ? "" : String(submission.score));
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const [error, setError] = useState<string | undefined>();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const problem = scoreProblem(score);
    setError(problem ?? undefined);
    if (!problem) onSave(Number(score), feedback.trim());
  }

  const id = `grade-${submission.id}`;

  return (
    <form className="grade-form" onSubmit={handleSubmit} noValidate>
      <FormField
        id={`${id}-score`}
        label={`Score for ${submission.studentName} (0–100)`}
        type="number"
        min={0}
        max={100}
        value={score}
        onChange={setScore}
        error={error}
        autoFocus
      />
      <FormTextArea id={`${id}-feedback`} label="Feedback" optional rows={3} value={feedback} onChange={setFeedback} />
      <div className="dashboard__actions">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save grade"}
        </Button>
        <Button type="button" variant="ghost" disabled={saving} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
