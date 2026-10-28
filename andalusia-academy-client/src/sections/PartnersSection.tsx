import { useApi } from "../hooks/useApi";
import { partnersUrl } from "../services/cms";
import type { Partner } from "../types";
import SectionHeader from "../components/SectionHeader";
import { LoadingState } from "../components/StateViews";
import "./PartnersSection.css";

function PartnerLogo({ partner }: { partner: Partner }) {
  const content = (
    <>
      <img src={partner.logoUrl} alt="" className="partners__logo" />
      <span className="partners__name">{partner.name}</span>
    </>
  );

  return partner.websiteUrl ? (
    <a
      href={partner.websiteUrl}
      className="partners__item"
      target="_blank"
      rel="noreferrer"
    >
      {content}
    </a>
  ) : (
    <div className="partners__item">{content}</div>
  );
}

export default function PartnersSection() {
  const { data, loading } = useApi<Partner[]>(partnersUrl());

  if (!loading && (!data || data.length === 0)) return null;

  return (
    <section className="section partners">
      <div className="container">
        <SectionHeader title="Our partners" align="center" />
        {loading ? (
          <LoadingState label="Loading partners…" />
        ) : (
          <div className="partners__row">
            {data?.map((partner) => (
              <PartnerLogo key={partner.id} partner={partner} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
