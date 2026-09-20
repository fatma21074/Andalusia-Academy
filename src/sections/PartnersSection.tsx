import { partners } from "../data/mockData";
import SectionHeader from "../components/SectionHeader";
import "./PartnersSection.css";

export default function PartnersSection() {
  return (
    <section className="section partners">
      <div className="container">
        <SectionHeader title="Our partners" align="center" />
        <div className="partners__row">
          {partners.map((partner) => (
            <div key={partner.id} className="partners__item">
              {partner.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
