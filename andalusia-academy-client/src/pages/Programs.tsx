import { useSearchParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { programsUrl } from "../services/catalog";
import type { PagedResult, Program } from "../types";
import SectionHeader from "../components/SectionHeader";
import ProgramCard from "../components/ProgramCard";
import CardGrid from "../components/CardGrid";
import SearchBox from "../components/SearchBox";
import Pagination from "../components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "../components/StateViews";
import "./Courses.css";

const PAGE_SIZE = 9;

export default function Programs() {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const programs = useApi<PagedResult<Program>>(programsUrl({ search, page, pageSize: PAGE_SIZE }));
  const result = programs.data;

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
        <SectionHeader title="Programs" description="Structured learning paths made of multiple courses." />

        <div className="catalog-filters">
          <SearchBox
            label="Search"
            placeholder="Search programs by title"
            value={search}
            onSearch={(value) => updateParams({ q: value, page: "" })}
          />
        </div>

        {programs.error && !result && <ErrorState message={programs.error.message} onRetry={programs.reload} />}
        {programs.loading && !result && <LoadingState label="Loading programs…" />}

        {result && result.data.length === 0 && (
          <EmptyState
            title="No programs found"
            message={search ? "Try a different search." : "New programs will appear here soon."}
          />
        )}

        {result && result.data.length > 0 && (
          <>
            <CardGrid dimmed={programs.loading}>
              {result.data.map((program) => (
                <ProgramCard key={program.id} program={program} />
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
