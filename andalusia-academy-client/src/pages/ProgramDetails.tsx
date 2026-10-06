import { Link, useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { programUrl } from "../services/catalog";
import type { ProgramDetail } from "../types";
import { formatPrice } from "../utils/format";
import Button from "../components/Button";
import CardGrid from "../components/CardGrid";
import CourseCard from "../components/CourseCard";
import DetailFacts from "../components/DetailFacts";
import StatusBadge from "../components/StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "../components/StateViews";
import "./DetailPage.css";

export default function ProgramDetails() {
  const { id } = useParams();
  const { data: program, loading, error, reload } = useApi<ProgramDetail>(id ? programUrl(id) : null);

  return (
    <section className="section">
      <div className="container">
        <Link to="/programs" className="detail__back">
          ← All programs
        </Link>

        {loading && <LoadingState label="Loading program…" />}
        {error && <ErrorState message={error.message} onRetry={error.status === 404 ? undefined : reload} />}
        {!loading && !error && program && <ProgramContent program={program} />}
      </div>
    </section>
  );
}

function ProgramContent({ program }: { program: ProgramDetail }) {
  return (
    <>
      <div className="detail__header detail__header--no-image">
        <div>
          <span className="detail__category">{program.categoryName}</span>
          <h1 className="detail__title">{program.title}</h1>
          {program.overview && <p className="detail__lead">{program.overview}</p>}
          <div className="detail__actions">
            <StatusBadge status={program.status} showOpen />
            {/* Sprint 3 replaces this with the real application flow. */}
            {program.status === "open" && (
              <Link to="/contact">
                <Button variant="primary">Contact admissions to enroll</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <DetailFacts
        facts={[
          { label: "Price", value: formatPrice(program.price) },
          { label: "Duration", value: program.duration },
          { label: "Location", value: program.location },
          { label: "Requirements", value: program.requirements },
        ]}
      />

      <div className="detail__block">
        <h2>Included courses</h2>
        {program.includedCourses.length === 0 ? (
          <EmptyState title="No courses yet" message="Courses for this program will be added soon." />
        ) : (
          <CardGrid>
            {program.includedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </CardGrid>
        )}
      </div>
    </>
  );
}
