import { useEffect, useRef, useState } from "react";
import "./SearchBox.css";

interface SearchBoxProps {
  value: string;
  placeholder?: string;
  label: string;
  onSearch: (value: string) => void;
}

const DEBOUNCE_MS = 350;

export default function SearchBox({ value, placeholder, label, onSearch }: SearchBoxProps) {
  const [text, setText] = useState(value);
  const [lastValue, setLastValue] = useState(value);
  const timer = useRef<number | undefined>(undefined);

  // Keep the input in sync when the URL changes from outside (back button, "Clear filters").
  if (value !== lastValue) {
    setLastValue(value);
    if (value !== text) setText(value);
  }

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function handleChange(next: string) {
    setText(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onSearch(next.trim()), DEBOUNCE_MS);
  }

  return (
    <label className="search-box">
      <span className="search-box__label">{label}</span>
      <input
        type="search"
        className="search-box__input"
        value={text}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
      />
    </label>
  );
}
