import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { defaultHome, redirectTarget } from "../auth/redirect";
import { ApiError } from "../services/api";
import { emailProblem, onlyProblems, passwordProblem, requiredProblem } from "../utils/validation";
import Alert from "../components/Alert";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import FormField from "../components/FormField";

const PHONE_PATTERN = /^\+?[\d\s-]{7,}$/;

export default function Register() {
  const { user, register } = useAuth();
  const location = useLocation();
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    country: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={redirectTarget(location.state, defaultHome(user.role))} replace />;

  const set = (field: keyof typeof values) => (value: string) => setValues((v) => ({ ...v, [field]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const problems = onlyProblems({
      firstName: requiredProblem(values.firstName, "First name"),
      lastName: requiredProblem(values.lastName, "Last name"),
      email: emailProblem(values.email),
      password: passwordProblem(values.password),
      confirmPassword: values.confirmPassword === values.password ? null : "Passwords don't match.",
      phoneNumber:
        values.phoneNumber.trim() && !PHONE_PATTERN.test(values.phoneNumber.trim())
          ? "Enter a valid phone number."
          : null,
    });
    setErrors(problems);
    if (Object.keys(problems).length > 0) return;

    setSubmitting(true);
    setFormError(null);
    try {
      await register({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        password: values.password,
        phoneNumber: values.phoneNumber.trim() || undefined,
        country: values.country.trim() || undefined,
      });
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Andalusia Academy and start learning today."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" state={location.state}>
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {formError && <Alert tone="error">{formError}</Alert>}
        <div className="auth-card__row">
          <FormField
            id="firstName"
            label="First name"
            autoComplete="given-name"
            value={values.firstName}
            onChange={set("firstName")}
            error={errors.firstName}
          />
          <FormField
            id="lastName"
            label="Last name"
            autoComplete="family-name"
            value={values.lastName}
            onChange={set("lastName")}
            error={errors.lastName}
          />
        </div>
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={set("email")}
          error={errors.email}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={set("password")}
          error={errors.password}
        />
        <FormField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={set("confirmPassword")}
          error={errors.confirmPassword}
        />
        <div className="auth-card__row">
          <FormField
            id="phoneNumber"
            label="Phone"
            type="tel"
            autoComplete="tel"
            optional
            value={values.phoneNumber}
            onChange={set("phoneNumber")}
            error={errors.phoneNumber}
          />
          <FormField
            id="country"
            label="Country"
            autoComplete="country-name"
            optional
            value={values.country}
            onChange={set("country")}
          />
        </div>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
