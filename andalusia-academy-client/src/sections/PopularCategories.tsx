import { popularCategories } from "../data/mockData";
import SectionHeader from "../components/SectionHeader";
import "./PopularCategories.css";

export default function PopularCategories() {
  return (
    <section className="section section--alt popular-categories">
      <div className="container">
        <SectionHeader title="Popular categories" />
        <div className="popular-categories__grid">
          {popularCategories.map((category) => (
            <a key={category} href="/courses" className="popular-categories__item">
              {category}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
