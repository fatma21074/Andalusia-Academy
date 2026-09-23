import "./Badge.css";

interface BadgeProps {
  label: string;
  tone?: "default" | "accent" | "muted";
}

export default function Badge({ label, tone = "default" }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{label}</span>;
}
