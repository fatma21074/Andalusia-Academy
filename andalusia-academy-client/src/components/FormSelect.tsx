import type { SelectHTMLAttributes } from "react";
import "./FormField.css";

interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export default function FormSelect({
  id,
  label,
  value,
  options,
  onChange,
  placeholder,
  error,
  ...selectProps
}: FormSelectProps) {
  const errorId = `${id}-error`;

  return (
    <div className={`form-field ${error ? "form-field--invalid" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...selectProps}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="form-field__error">
          {error}
        </p>
      )}
    </div>
  );
}
