import "./learning.css";

interface ProgressBarProps {
  percent: number;
  label: string;
}

export default function ProgressBar({ percent, label }: ProgressBarProps) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className="progress">
      <div
        className="progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <div className="progress__fill" style={{ width: `${value}%` }} />
      </div>
      <span className="progress__value">{value}%</span>
    </div>
  );
}
