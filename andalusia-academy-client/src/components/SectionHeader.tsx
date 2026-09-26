import "./SectionHeader.css";

interface SectionHeaderProps {
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeader({ title, description, align = "left" }: SectionHeaderProps) {
  return (
    <div className={`section-header section-header--${align}`}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
