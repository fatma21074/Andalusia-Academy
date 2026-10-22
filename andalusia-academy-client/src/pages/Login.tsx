import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { redirectTarget } from "../auth/redirect";
import { ApiError } from "../services/api";
import { emailProblem, onlyProblems, requiredProblem } from "../utils/validation";
import Alert from "../components/Alert";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import FormField from "../components/FormField";

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const destination = redirectTarget(location.state, "/");
  if (user) return <Navigate to={destination} replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const problems = onlyProblems({
      email: emailProblem(email),
      password: requiredProblem(password, "Password"),
    });
    setErrors(problems);
    if (Object.keys(problems).length > 0) return;

    setSubmitting(true);
    setFormError(null);
    try {
      await login({ email: email.trim(), password });
      // The redirect above runs as soon as the session is set.
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your learning."
      footer={
        <>
          New to Andalusia? <Link to="/register" state={location.state}>Create an account</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {formError && <Alert tone="error">{formError}</Alert>}
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          error={errors.password}
        />
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
