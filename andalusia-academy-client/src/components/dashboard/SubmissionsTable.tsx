import { Fragment, useState } from "react";
import type { InstructorSubmission } from "../../types";
import { formatDate } from "../../utils/format";
import Button from "../Button";
import GradeForm from "./GradeForm";

interface SubmissionsTableProps {
  submissions: InstructorSubmission[];
  saving: boolean;
  onGrade: (submissionId: number, score: number, feedback: string) => Promise<boolean>;
}

export default function SubmissionsTable({ submissions, saving, onGrade }: SubmissionsTableProps) {
  const [gradingId, setGradingId] = useState<number | null>(null);

  return (
    <div className="table-wrap">
      <table className="data-table">
        <caption className="sr-only">Submissions for the selected assignment</caption>
        <thead>
          <tr>
            <th scope="col">Student</th>
            <th scope="col">Submitted</th>
            <th scope="col">File</th>
            <th scope="col">Status</th>
            <th scope="col">Score</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <Fragment key={submission.id}>
              <tr>
                <td data-label="Student">{submission.studentName}</td>
                <td data-label="Submitted">{formatDate(submission.submittedAt)}</td>
                <td data-label="File">
                  {submission.fileUrl ? (
                    <a href={submission.fileUrl} target="_blank" rel="noreferrer">
                      Open file
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td data-label="Status">{submission.status}</td>
                <td data-label="Score">{submission.score ?? "—"}</td>
                <td data-label="Actions">
                  <Button
                    variant="secondary"
                    aria-expanded={gradingId === submission.id}
                    onClick={() => setGradingId(gradingId === submission.id ? null : submission.id)}
                  >
                    {submission.score === null ? "Grade" : "Regrade"}
                  </Button>
                </td>
              </tr>
              {gradingId === submission.id && (
                <tr>
                  <td colSpan={6}>
                    <GradeForm
                      submission={submission}
                      saving={saving}
                      onCancel={() => setGradingId(null)}
                      onSave={async (score, feedback) => {
                        if (await onGrade(submission.id, score, feedback)) setGradingId(null);
                      }}
                    />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
