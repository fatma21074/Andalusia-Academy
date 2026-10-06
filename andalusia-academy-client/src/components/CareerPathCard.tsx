import { Link } from "react-router-dom";
import type { CareerPath } from "../types";
import { splitSkills } from "../utils/format";
import Card from "./Card";
import Badge from "./Badge";
import "./CatalogCard.css";

export default function CareerPathCard({ careerPath }: { careerPath: CareerPath }) {
  const skills = splitSkills(careerPath.recommendedSkills);

  return (
    <Link to={`/career-paths/${careerPath.id}`} className="catalog-card-link">
      <Card className="catalog-card">
        <h3>{careerPath.title}</h3>
        {careerPath.description && <p className="catalog-card__text">{careerPath.description}</p>}
        {skills.length > 0 && (
          <ul className="catalog-card__chips" aria-label="Recommended skills">
            {skills.slice(0, 4).map((skill) => (
              <li key={skill}>
                <Badge label={skill} />
              </li>
            ))}
          </ul>
        )}
        <span className="catalog-card__link">Explore path →</span>
      </Card>
    </Link>
  );
}
