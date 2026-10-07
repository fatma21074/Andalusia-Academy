import { Link, useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { careerPathUrl } from "../services/catalog";
import type { CareerPathDetail } from "../types";
import { splitSkills } from "../utils/format";
import Badge from "../components/Badge";
import CardGrid from "../components/CardGrid";
import CourseCard from "../components/CourseCard";
import ProgramCard from "../components/ProgramCard";
import { ErrorState, LoadingState } from "../components/StateViews";
import "./DetailPage.css";

export default function CareerPathDetails() {
  const { id } = useParams();
  const { data: careerPath, loading, error, reload } = useApi<CareerPathDetail>(id ? careerPathUrl(id) : null);

  return (
    <section className="section">
      <div className="container">
        <Link to="/career-paths" className="detail__back">
          ← All career paths
        </Link>

        {loading && <LoadingState label="Loading career path…" />}
        {error && <ErrorState message={error.message} onRetry={error.status === 404 ? undefined : reload} />}
        {!loading && !error && careerPath && <CareerPathContent careerPath={careerPath} />}
      </div>
    </section>
  );
}

function CareerPathContent({ careerPath }: { careerPath: CareerPathDetail }) {
  const skills = splitSkills(careerPath.recommendedSkills);

  return (
    <>
      <div className="detail__header detail__header--no-image">
        <div>
          <h1 className="detail__title">{careerPath.title}</h1>
          {careerPath.description && <p className="detail__lead">{careerPath.description}</p>}
        </div>
      </div>

      {skills.length > 0 && (
        <div className="detail__block">
          <h2>Recommended skills</h2>
          <ul className="detail__chips">
            {skills.map((skill) => (
              <li key={skill}>
                <Badge label={skill} tone="accent" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {careerPath.relatedPrograms.length > 0 && (
        <div className="detail__block">
          <h2>Related programs</h2>
          <CardGrid>
            {careerPath.relatedPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </CardGrid>
        </div>
      )}

      {careerPath.recommendedCourses.length > 0 && (
        <div className="detail__block">
          <h2>Recommended courses</h2>
          <CardGrid>
            {careerPath.recommendedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </CardGrid>
        </div>
      )}
    </>
  );
}
