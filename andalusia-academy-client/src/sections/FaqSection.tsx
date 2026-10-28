import { useApi } from "../hooks/useApi";
import { faqsUrl } from "../services/cms";
import type { Faq } from "../types";
import SectionHeader from "../components/SectionHeader";
import { LoadingState } from "../components/StateViews";
import "./FaqSection.css";

export default function FaqSection() {
  const { data, loading } = useApi<Faq[]>(faqsUrl());

  if (!loading && (!data || data.length === 0)) return null;

  return (
    <section className="section section--alt" id="faq">
      <div className="container faq">
        <SectionHeader title="Frequently asked questions" align="center" />
        {loading ? (
          <LoadingState label="Loading questions…" />
        ) : (
          <div className="faq__list">
            {[...(data ?? [])]
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((faq) => (
                <details key={faq.id} className="faq__item">
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
