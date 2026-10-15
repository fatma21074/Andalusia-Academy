import Button from "../components/Button";
import "./CorporateSection.css";

export default function CorporateSection() {
  return (
    <section className="section corporate">
      <div className="container corporate__inner">
        <div>
          <h2>Training for your team</h2>
          <p>
            Custom cohorts, flexible scheduling, and progress reporting for companies investing in
            their people's technical skills.
          </p>
        </div>
        <Button variant="secondary">Talk to Our Corporate Team</Button>
      </div>
    </section>
  );
}
