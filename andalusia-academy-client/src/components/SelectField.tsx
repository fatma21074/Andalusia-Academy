import "./SelectField.css";

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export default function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="select-field">
      <span className="select-field__label">{label}</span>
      <select className="select-field__input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
