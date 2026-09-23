import { programs } from "../data/mockData";
import SectionHeader from "../components/SectionHeader";
import Card from "../components/Card";

// Sprint 1 placeholder — full program details and course relationships arrive in Sprint 2.
export default function Programs() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader title="Programs" description="Structured learning paths made of multiple courses." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {programs.map((program) => (
            <Card key={program.id}>
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <span style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>
                {program.courseCount} courses
              </span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
