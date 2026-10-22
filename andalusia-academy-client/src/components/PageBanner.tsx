import { Link } from "react-router-dom";
import "./PageBanner.css";

interface Crumb {
  label: string;
  to?: string;
}

interface PageBannerProps {
  title: string;
  crumbs?: Crumb[];
}

export default function PageBanner({ title, crumbs = [] }: PageBannerProps) {
  return (
    <section className="page-banner gradient-soft">
      <div className="container">
        <h1>{title}</h1>
        <nav className="page-banner__crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {crumbs.map((crumb) => (
            <span key={crumb.label}>
              <span aria-hidden="true"> / </span>
              {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
