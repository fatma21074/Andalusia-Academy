import type { TextareaHTMLAttributes } from "react";
import "./FormField.css";

interface FormTextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  optional?: boolean;
}

export default function FormTextArea({
  id,
  label,
  value,
  onChange,
  error,
  optional = false,
  ...textareaProps
}: FormTextAreaProps) {
  const errorId = `${id}-error`;

  return (
    <div className={`form-field ${error ? "form-field--invalid" : ""}`}>
      <label htmlFor={id}>
        {label}
        {optional && <span className="form-field__optional"> (optional)</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...textareaProps}
      />
      {error && (
        <p id={errorId} className="form-field__error">
          {error}
        </p>
      )}
    </div>
  );
}
