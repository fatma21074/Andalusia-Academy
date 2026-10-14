import type { ReactNode } from "react";
import "./AuthLayout.css";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <section className="auth-page gradient-soft">
      <div className="auth-card">
        <h1>{title}</h1>
        <p className="auth-card__subtitle">{subtitle}</p>
        {children}
        <p className="auth-card__footer">{footer}</p>
      </div>
    </section>
  );
}
