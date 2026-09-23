import { featuredCourses } from "../data/mockData";
import SectionHeader from "../components/SectionHeader";
import CourseCard from "../components/CourseCard";
import "./FeaturedCourses.css";

export default function FeaturedCourses() {
  return (
    <section className="section featured-courses">
      <div className="container">
        <SectionHeader
          title="Featured & trending courses"
          description="A snapshot of what learners are enrolling in right now."
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
