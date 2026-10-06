import { useApi } from "../hooks/useApi";
import { coursesUrl } from "../services/catalog";
import type { Course, PagedResult } from "../types";
import SectionHeader from "../components/SectionHeader";
import CourseCard from "../components/CourseCard";
import CardGrid from "../components/CardGrid";

const url = coursesUrl({ status: "coming-soon", pageSize: 3 });

export default function ComingSoonSection() {
  const { data } = useApi<PagedResult<Course>>(url);

  // Nothing coming soon (or the request failed) → skip the section rather than show an empty block.
  if (!data || data.data.length === 0) return null;

  return (
    <section className="section section--alt">
      <div className="container">
        <SectionHeader title="Coming soon" description="New courses we're preparing for the next intake." />
        <CardGrid>
          {data.data.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </CardGrid>
      </div>
    </section>
  );
}
