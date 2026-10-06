import { useSearchParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { categoriesUrl, coursesUrl } from "../services/catalog";
import type { Category, Course, PagedResult } from "../types";
import SectionHeader from "../components/SectionHeader";
import CourseCard from "../components/CourseCard";
import CardGrid from "../components/CardGrid";
import SearchBox from "../components/SearchBox";
import SelectField from "../components/SelectField";
import Pagination from "../components/Pagination";
import Button from "../components/Button";
import { EmptyState, ErrorState, LoadingState } from "../components/StateViews";
import "./Courses.css";

const PAGE_SIZE = 9;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest", sortBy: "createdat", order: "desc" },
  { value: "title-asc", label: "Title: A to Z", sortBy: "title", order: "asc" },
  { value: "title-desc", label: "Title: Z to A", sortBy: "title", order: "desc" },
  { value: "price-asc", label: "Price: low to high", sortBy: "price", order: "asc" },
  { value: "price-desc", label: "Price: high to low", sortBy: "price", order: "desc" },
] as const;

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "open", label: "Open for enrollment" },
  { value: "coming-soon", label: "Coming soon" },
  { value: "closed", label: "Closed" },
];

export default function Courses() {
  const [params, setParams] = useSearchParams();

  const search = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const status = params.get("status") ?? "";
  const sort = params.get("sort") ?? "newest";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const sortOption = SORT_OPTIONS.find((option) => option.value === sort) ?? SORT_OPTIONS[0];

  const courses = useApi<PagedResult<Course>>(
    coursesUrl({
      search,
      categoryId: category ? Number(category) : undefined,
      status,
      sortBy: sortOption.sortBy,
      order: sortOption.order,
      page,
      pageSize: PAGE_SIZE,
    }),
  );
  const categories = useApi<Category[]>(categoriesUrl());

  function updateParams(changes: Record<string, string>, keepPage = false) {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      if (!keepPage) next.delete("page");
      return next;
    });
  }

  function changePage(nextPage: number) {
    updateParams({ page: nextPage > 1 ? String(nextPage) : "" }, true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const hasFilters = Boolean(search || category || status || sort !== "newest");
  const clearFilters = () => setParams({});

  const categoryOptions = [
    { value: "", label: "All categories" },
    ...(categories.data ?? []).map((c) => ({ value: String(c.id), label: c.name })),
  ];

  const result = courses.data;

  return (
    <section className="section">
      <div className="container">
        <SectionHeader title="Courses" description="Browse all courses and find the one that fits your goals." />

        <div className="catalog-filters">
          <SearchBox
            label="Search"
            placeholder="Search courses by title"
            value={search}
            onSearch={(value) => updateParams({ q: value })}
          />
          {categoryOptions.length > 1 && (
            <SelectField
              label="Category"
              value={category}
              options={categoryOptions}
              onChange={(value) => updateParams({ category: value })}
            />
          )}
          <SelectField
            label="Status"
            value={status}
            options={STATUS_OPTIONS}
            onChange={(value) => updateParams({ status: value })}
          />
          <SelectField
            label="Sort by"
            value={sortOption.value}
            options={SORT_OPTIONS.map(({ value, label }) => ({ value, label }))}
            onChange={(value) => updateParams({ sort: value === "newest" ? "" : value })}
          />
        </div>

        {result && (
          <p className="catalog-summary" aria-live="polite">
            {result.totalCount} {result.totalCount === 1 ? "course" : "courses"} found
            {hasFilters && (
              <button type="button" className="catalog-summary__clear" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </p>
        )}

        {courses.error && !result && <ErrorState message={courses.error.message} onRetry={courses.reload} />}
        {courses.loading && !result && <LoadingState label="Loading courses…" />}

        {result && result.data.length === 0 && (
          <EmptyState
            title="No courses found"
            message={hasFilters ? "Try a different search or remove some filters." : "New courses will appear here soon."}
            action={
              hasFilters ? (
                <Button variant="ghost" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        )}

        {result && result.data.length > 0 && (
          <>
            <CardGrid dimmed={courses.loading}>
              {result.data.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </CardGrid>
            <Pagination page={result.page} totalPages={result.totalPages} onChange={changePage} />
          </>
        )}
      </div>
    </section>
  );
}
