interface DetailFactsProps {
  facts: { label: string; value: string | null | undefined }[];
}

// Renders only the facts that have a value, so missing optional fields don't leave gaps.
export default function DetailFacts({ facts }: DetailFactsProps) {
  const visible = facts.filter((fact) => fact.value);
  if (visible.length === 0) return null;

  return (
    <dl className="detail__facts">
      {visible.map((fact) => (
        <div key={fact.label} className="detail__fact">
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
