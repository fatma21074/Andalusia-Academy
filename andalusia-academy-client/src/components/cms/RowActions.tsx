import { useState } from "react";
import Button from "../Button";

interface RowActionsProps {
  label: string;
  busy: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

/** Edit and Delete buttons, where Delete asks for confirmation in place. */
export default function RowActions({
  label,
  busy,
  onEdit,
  onDelete,
}: RowActionsProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div
        className="dashboard__actions"
        role="group"
        aria-label={`Confirm deleting ${label}`}
      >
        <Button
          variant="secondary"
          disabled={busy}
          onClick={() => {
            setConfirming(false);
            onDelete();
          }}
        >
          Confirm delete
        </Button>
        <Button variant="ghost" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="dashboard__actions">
      <Button variant="secondary" disabled={busy} onClick={onEdit}>
        Edit
      </Button>
      <Button
        variant="secondary"
        disabled={busy}
        onClick={() => setConfirming(true)}
      >
        Delete
      </Button>
    </div>
  );
}
