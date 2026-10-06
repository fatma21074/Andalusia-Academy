import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { categoriesUrl } from "../services/catalog";
import type { Category } from "../types";
import SectionHeader from "../components/SectionHeader";
import "./PopularCategories.css";

export default function PopularCategories() {
  const { data } = useApi<Category[]>(categoriesUrl());

  // Hide the section if categories can't be loaded; the rest of the homepage still works.
  if (!data || data.length === 0) return null;

  return (
    <section className="section section--alt popular-categories">
      <div className="container">
        <SectionHeader title="Popular categories" />
        <div className="popular-categories__grid">
          {data.map((category) => (
            <Link key={category.id} to={`/courses?category=${category.id}`} className="popular-categories__item">
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
