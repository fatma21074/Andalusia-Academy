import PageBanner from "../components/PageBanner";

export default function About() {
  return (
    <>
      <PageBanner title="About Andalusia Academy" crumbs={[{ label: "About" }]} />
      <section className="section">
        <div className="container">
          <p className="lead">
            Practical, career-focused technical education built with instructors who work in the field.
          </p>
          <p style={{ maxWidth: "70ch" }}>
            Andalusia Academy was founded to close the gap between what's taught in classrooms and what employers
            actually need. Every course is project-based, every instructor is currently working in their field, and
            every program maps directly to a career path our learners can pursue after graduation.
          </p>
        </div>
      </section>
    </>
  );
}
