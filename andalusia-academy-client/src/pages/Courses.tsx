import { featuredCourses } from "../data/mockData";
import SectionHeader from "../components/SectionHeader";
import CourseCard from "../components/CourseCard";

// Sprint 1 placeholder: shows mock data so the route isn't broken.
// Sprint 2 replaces this with real search/filter/sort against the API.
export default function Courses() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          title="Courses"
          description="Browse all available courses. Search and filtering arrive in Sprint 2."
        />
        <div className="featured-courses__grid">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
