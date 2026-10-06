import { useSearchParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { careerPathsUrl } from "../services/catalog";
import type { CareerPath, PagedResult } from "../types";
import SectionHeader from "../components/SectionHeader";
import CareerPathCard from "../components/CareerPathCard";
import CardGrid from "../components/CardGrid";
import SearchBox from "../components/SearchBox";
import Pagination from "../components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "../components/StateViews";
import "./Courses.css";

const PAGE_SIZE = 9;

export default function CareerPaths() {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const careerPaths = useApi<PagedResult<CareerPath>>(careerPathsUrl({ search, page, pageSize: PAGE_SIZE }));
  const result = careerPaths.data;

  function updateParams(changes: Record<string, string>) {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      return next;
    });
  }

  return (
    <section className="section">
      <div className="container">
        <SectionHeader title="Career Paths" description="See which skills lead to which roles." />

        <div className="catalog-filters">
          <SearchBox
            label="Search"
            placeholder="Search career paths by title"
            value={search}
            onSearch={(value) => updateParams({ q: value, page: "" })}
          />
        </div>

        {careerPaths.error && !result && (
          <ErrorState message={careerPaths.error.message} onRetry={careerPaths.reload} />
        )}
        {careerPaths.loading && !result && <LoadingState label="Loading career paths…" />}

        {result && result.data.length === 0 && (
          <EmptyState
            title="No career paths found"
            message={search ? "Try a different search." : "Career paths will appear here soon."}
          />
        )}

        {result && result.data.length > 0 && (
          <>
            <CardGrid dimmed={careerPaths.loading}>
              {result.data.map((careerPath) => (
                <CareerPathCard key={careerPath.id} careerPath={careerPath} />
              ))}
            </CardGrid>
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              onChange={(next) => {
                updateParams({ page: next > 1 ? String(next) : "" });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </>
        )}
      </div>
    </section>
  );
}
