import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { careerPathsUrl } from "../services/catalog";
import type { CareerPath, PagedResult } from "../types";
import SectionHeader from "../components/SectionHeader";
import CareerPathCard from "../components/CareerPathCard";
import CardGrid from "../components/CardGrid";
import { ErrorState, LoadingState } from "../components/StateViews";
import "./CareerPathDiscovery.css";

const url = careerPathsUrl({ pageSize: 3 });

export default function CareerPathDiscovery() {
  const { data, loading, error, reload } = useApi<PagedResult<CareerPath>>(url);

  return (
    <section className="section career-paths">
      <div className="container">
        <SectionHeader
          title="Find your career path"
          description="Not sure where to start? See which skills lead to which roles."
        />
        {loading && !data && <LoadingState label="Loading career paths…" />}
        {error && <ErrorState message={error.message} onRetry={reload} />}
        {data && data.data.length > 0 && (
          <>
            <CardGrid>
              {data.data.map((careerPath) => (
                <CareerPathCard key={careerPath.id} careerPath={careerPath} />
              ))}
            </CardGrid>
            <p style={{ marginTop: 24 }}>
              <Link to="/career-paths" className="career-paths__link">
                View all career paths →
              </Link>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
