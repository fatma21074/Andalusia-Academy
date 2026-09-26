import { careerPaths } from "../data/mockData";
import SectionHeader from "../components/SectionHeader";
import Card from "../components/Card";

// Sprint 1 placeholder — recommended skills/journeys arrive in Sprint 2.
export default function CareerPaths() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader title="Career Paths" description="See which skills lead to which roles." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {careerPaths.map((path) => (
            <Card key={path.id}>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
