import type { InputHTMLAttributes } from "react";
import "./FormField.css";

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  optional?: boolean;
}

export default function FormField({
  id,
  label,
  value,
  onChange,
  error,
  optional = false,
  ...inputProps
}: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={`form-field ${error ? "form-field--invalid" : ""}`}>
      <label htmlFor={id}>
        {label}
        {optional && <span className="form-field__optional"> (optional)</span>}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="form-field__error">
          {error}
        </p>
      )}
    </div>
  );
}
