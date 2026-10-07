import type { ReactNode } from "react";
import "./CardGrid.css";

interface CardGridProps {
  children: ReactNode;
  dimmed?: boolean;
}

export default function CardGrid({ children, dimmed = false }: CardGridProps) {
  return <div className={`card-grid ${dimmed ? "card-grid--dimmed" : ""}`}>{children}</div>;
}
