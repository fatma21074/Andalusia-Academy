import "./StatCard.css";

type StatIcon = "book" | "cap" | "route" | "grid";

const ICONS: Record<StatIcon, string> = {
  book: "M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Zm2 14h12M9 7h6",
  cap: "M12 4 2 9l10 5 10-5-10-5Zm-6 8v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4",
  route:
    "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12-10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8 17h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6",
  grid: "M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z",
};

interface StatCardProps {
  icon: StatIcon;
  label: string;
  value: number | string | undefined;
  tone: "coral" | "indigo" | "violet" | "teal";
}

export default function StatCard({ icon, label, value, tone }: StatCardProps) {
  return (
    <div className="stat-card">
      <span className={`stat-card__icon stat-card__icon--${tone}`} aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={ICONS[icon]} />
        </svg>
      </span>
      <div>
        <strong className="stat-card__value">{value ?? "—"}</strong>
        <span className="stat-card__label">{label}</span>
      </div>
    </div>
  );
}
