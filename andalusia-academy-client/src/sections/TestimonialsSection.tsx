import { useApi } from "../hooks/useApi";
import { testimonialsUrl } from "../services/cms";
import type { Testimonial } from "../types";
import SectionHeader from "../components/SectionHeader";
import Card from "../components/Card";
import { LoadingState } from "../components/StateViews";
import "./TestimonialsSection.css";

export default function TestimonialsSection() {
  const { data, loading } = useApi<Testimonial[]>(testimonialsUrl());

  // The homepage should never show an error box for optional content: hide the section instead.
  if (!loading && (!data || data.length === 0)) return null;

  return (
    <section className="section section--alt testimonials">
      <div className="container">
        <SectionHeader title="What our graduates say" align="center" />
        {loading ? (
          <LoadingState label="Loading testimonials…" />
        ) : (
          <div className="testimonials__grid">
            {data?.map((t) => (
              <Card key={t.id} className="testimonials__card">
                <p className="testimonials__quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="testimonials__author">
                  <span className="testimonials__initial" aria-hidden="true">
                    {t.authorName.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <strong>{t.authorName}</strong>
                    {t.displayRole && <span>{t.displayRole}</span>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
