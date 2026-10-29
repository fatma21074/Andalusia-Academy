import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import FaqsPanel from "../components/cms/FaqsPanel";
import PartnersPanel from "../components/cms/PartnersPanel";
import TestimonialsPanel from "../components/cms/TestimonialsPanel";
import PageBanner from "../components/PageBanner";
import "../components/dashboard/Dashboard.css";

const TABS = [
  { id: "testimonials", label: "Testimonials" },
  { id: "partners", label: "Partners" },
  { id: "faqs", label: "FAQs" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminContent() {
  const [tab, setTab] = useState<TabId>("testimonials");

  return (
    <>
      <PageBanner
        title="Website Content"
        crumbs={[
          { label: "Admin dashboard", to: "/admin" },
          { label: "Website content" },
        ]}
      />
      <section className="section">
        <div className="container dashboard">
          <p className="dashboard__muted">
            Manage what visitors see on the homepage and About page. Hidden
            items stay saved but are not shown.{" "}
            <Link to="/admin">Back to the dashboard</Link>
          </p>
          <div className="tabs" role="tablist" aria-label="Content type">
            {TABS.map((t) => (
              <Button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                variant={tab === t.id ? "primary" : "secondary"}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </Button>
            ))}
          </div>
          <div
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
          >
            {tab === "testimonials" && <TestimonialsPanel />}
            {tab === "partners" && <PartnersPanel />}
            {tab === "faqs" && <FaqsPanel />}
          </div>
        </div>
      </section>
    </>
  );
}
