import { Link } from "react-router-dom";
import { careerPaths } from "../data/mockData";
import SectionHeader from "../components/SectionHeader";
import Card from "../components/Card";
import "./CareerPathDiscovery.css";

export default function CareerPathDiscovery() {
  return (
    <section className="section career-paths">
      <div className="container">
        <SectionHeader
          title="Find your career path"
          description="Not sure where to start? See which skills lead to which roles."
        />
        <div className="career-paths__grid">
          {careerPaths.map((path) => (
            <Card key={path.id} className="career-paths__card">
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <Link to={`/career-paths/${path.id}`} className="career-paths__link">
                Explore path →
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
