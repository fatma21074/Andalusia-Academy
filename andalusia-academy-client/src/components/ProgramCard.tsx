import { Link } from "react-router-dom";
import type { Program } from "../types";
import { formatPrice } from "../utils/format";
import Card from "./Card";
import StatusBadge from "./StatusBadge";
import "./CatalogCard.css";

export default function ProgramCard({ program }: { program: Program }) {
  return (
    <Link to={`/programs/${program.id}`} className="catalog-card-link">
      <Card className="catalog-card">
        <StatusBadge status={program.status} />
        <h3>{program.title}</h3>
        {program.overview && <p className="catalog-card__text">{program.overview}</p>}
        <div className="catalog-card__meta">
          <span>
            {program.courseCount} {program.courseCount === 1 ? "course" : "courses"}
          </span>
          <span className="catalog-card__price">{formatPrice(program.price)}</span>
        </div>
      </Card>
    </Link>
  );
}
