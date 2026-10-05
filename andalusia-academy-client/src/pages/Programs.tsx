import { programs } from "../data/mockData";
import SectionHeader from "../components/SectionHeader";
import Card from "../components/Card";
import "./Programs.css";

// Sprint 1 placeholder — full program details and course relationships arrive in Sprint 2.
export default function Programs() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader title="Programs" description="Structured learning paths made of multiple courses." />
        <div className="programs__grid">
          {programs.map((program) => (
            <Card key={program.id}>
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <span className="programs__course-count">
                {program.courses.length} courses
              </span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
