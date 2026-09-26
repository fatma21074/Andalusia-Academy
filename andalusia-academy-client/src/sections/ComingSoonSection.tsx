import { comingSoonCourses } from "../data/mockData";
import SectionHeader from "../components/SectionHeader";
import CourseCard from "../components/CourseCard";
import "./FeaturedCourses.css"; // reuse the same grid styles

export default function ComingSoonSection() {
  return (
    <section className="section section--alt featured-courses">
      <div className="container">
        <SectionHeader
          title="Coming soon"
          description="New courses we're preparing for the next intake."
        />
        <div className="featured-courses__grid">
          {comingSoonCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
