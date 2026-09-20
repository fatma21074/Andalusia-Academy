import Button from "../components/Button";
import "./HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <h1>Learn the skills that get you hired — not just a certificate.</h1>
          <p>
            Andalusia Academy pairs practical, project-based courses with
            instructors who work in the field, so what you learn in class is
            what you'll use on the job.
          </p>
          <div className="hero__actions">
            <Button variant="primary">Explore Courses</Button>
            <Button variant="ghost">Talk to an Advisor</Button>
          </div>
        </div>
        <img
          src="/img/hero-image.jpg"
          alt="Students collaborating on a project in a learning environment, working together with a focused and engaged mood"
          className="hero__image"
        />
      </div>
    </section>
  );
}
