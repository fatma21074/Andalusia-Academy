import { careerPaths } from "../data/mockData";
import SectionHeader from "../components/SectionHeader";
import Card from "../components/Card";
import "./CareerPaths.css";

// Sprint 1 placeholder — recommended skills/journeys arrive in Sprint 2.
export default function CareerPaths() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader title="Career Paths" description="See which skills lead to which roles." />
        <div className="career-paths-page__grid">
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
