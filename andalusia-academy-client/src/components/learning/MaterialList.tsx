import type { MaterialInfo } from "../../types";
import Badge from "../Badge";
import "./learning.css";

const TYPE_LABEL: Record<string, string> = { link: "Link", file: "File" };

export default function MaterialList({ materials }: { materials: MaterialInfo[] }) {
  if (materials.length === 0) return <p className="learning-muted">Your instructor hasn't added materials yet.</p>;

  return (
    <ul className="material-list">
      {materials.map((material) => (
        <li key={material.id} className="material-list__item">
          <div>
            <Badge label={TYPE_LABEL[material.type] ?? "Resource"} tone="accent" />
            <span className="material-list__title">{material.title}</span>
          </div>
          <a href={material.url} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
            Open
            <span className="sr-only"> {material.title} in a new tab</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
