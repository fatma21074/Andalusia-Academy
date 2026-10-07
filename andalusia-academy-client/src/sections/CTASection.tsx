import Button from "../components/Button";
import "./CTASection.css";

export default function CTASection() {
  return (
    <section className="section cta">
      <div className="container cta__inner">
        <h2>Ready to start learning?</h2>
        <p>Applications for the next intake are open now.</p>
        <Button variant="primary">Apply Now</Button>
      </div>
    </section>
  );
}
