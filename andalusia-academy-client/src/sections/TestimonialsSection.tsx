import { testimonials } from "../data/mockData";
import SectionHeader from "../components/SectionHeader";
import Card from "../components/Card";
import "./TestimonialsSection.css";

export default function TestimonialsSection() {
  return (
    <section className="section section--alt testimonials">
      <div className="container">
        <SectionHeader title="What our graduates say" align="center" />
        <div className="testimonials__grid">
          {testimonials.map((t) => (
            <Card key={t.id} className="testimonials__card">
              <p className="testimonials__quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="testimonials__author">
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
