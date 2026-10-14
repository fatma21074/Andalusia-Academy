import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { careerPathsUrl, categoriesUrl, coursesUrl, programsUrl } from "../services/catalog";
import type { Category, PagedResult } from "../types";
import StatCard from "../components/StatCard";
import "./HeroSection.css";

// pageSize=1: we only need totalCount, not the items.
const coursesCountUrl = coursesUrl({ pageSize: 1 });
const programsCountUrl = programsUrl({ pageSize: 1 });
const careerPathsCountUrl = careerPathsUrl({ pageSize: 1 });

function useTotalCount(url: string) {
  return useApi<PagedResult<unknown>>(url).data?.totalCount;
}

export default function HeroSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const courses = useTotalCount(coursesCountUrl);
  const programs = useTotalCount(programsCountUrl);
  const careerPaths = useTotalCount(careerPathsCountUrl);
  const categories = useApi<Category[]>(categoriesUrl()).data?.length;

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const text = query.trim();
    navigate(text ? `/courses?q=${encodeURIComponent(text)}` : "/courses");
  }

  return (
    <section className="hero gradient-soft">
      <div className="container hero__inner">
        <div className="hero__content">
          <h1>
            <span className="hero__accent">Learn the skills</span> that get you hired, not just a certificate.
          </h1>
          <p>
            Andalusia Academy pairs practical, project-based courses with instructors who work in the
            field, so what you learn in class is what you'll use on the job.
          </p>
          <form className="hero__search" role="search" onSubmit={handleSearch}>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses"
              aria-label="Search courses"
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <div className="hero__media">
          <img src="/img/hero-student.webp" alt="A smiling student holding her notebooks" />
        </div>
      </div>

      <div className="container hero__stats">
        <StatCard icon="book" label="Online Courses" value={courses} tone="coral" />
        <StatCard icon="cap" label="Academic Programs" value={programs} tone="indigo" />
        <StatCard icon="route" label="Career Paths" value={careerPaths} tone="violet" />
        <StatCard icon="grid" label="Categories" value={categories} tone="teal" />
      </div>
    </section>
  );
}
