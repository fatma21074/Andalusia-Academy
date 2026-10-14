import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { ApiError } from "../services/api";
import { createApplication, type ApplicationTarget } from "../services/enrollment";
import Alert from "./Alert";
import Button from "./Button";

export default function ApplyButton({ target }: { target: ApplicationTarget }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<{ message: string; alreadyApplied: boolean } | null>(null);

  if (user && user.role !== "Learner") {
    return <p>Only learner accounts can apply.</p>;
  }

  async function handleApply() {
    // Signed-out visitors sign in first, then come back to this page.
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const application = await createApplication(target);
      navigate(`/checkout/${application.id}`);
    } catch (err) {
      const apiError = err instanceof ApiError ? err : null;
      setError({
        message: apiError?.message ?? "Something went wrong. Please try again.",
        alreadyApplied: apiError?.status === 409,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="apply">
      <Button variant="primary" onClick={handleApply} disabled={submitting}>
        {submitting ? "Applying…" : "Apply now"}
      </Button>
      {error && (
        <Alert tone="error">
          {error.message}
          {error.alreadyApplied && (
            <>
              {" "}
              <Link to="/my-applications">View my applications</Link>
            </>
          )}
        </Alert>
      )}
    </div>
  );
}
