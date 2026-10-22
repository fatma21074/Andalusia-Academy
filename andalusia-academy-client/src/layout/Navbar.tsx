import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../components/Logo";
import UserMenu from "../components/UserMenu";
import { useAuth } from "../auth/useAuth";
import "./Navbar.css";

const links = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/programs", label: "Programs" },
  { to: "/career-paths", label: "Career Paths" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [nightMode, setNightMode] = useState(
    () => document.documentElement.dataset.theme === "dark",
  );
  const close = () => setOpen(false);

  useEffect(() => {
    document.documentElement.dataset.theme = nightMode ? "dark" : "light";
    window.localStorage.setItem("andalusia-theme", nightMode ? "dark" : "light");
  }, [nightMode]);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Logo onClick={close} />
        <nav className={`navbar__links ${open ? "navbar__links--open" : ""}`} aria-label="Main">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => `navbar__link ${isActive ? "navbar__link--active" : ""}`}
              onClick={close}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="navbar__auth">
            {user ? (
              <UserMenu onNavigate={close} />
            ) : (
              <>
                <Link to="/login" className="navbar__signin" onClick={close}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn--primary" onClick={close}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
        <button
          className="navbar__theme-toggle"
          type="button"
          aria-label={nightMode ? "Switch to light mode" : "Switch to night mode"}
          aria-pressed={nightMode}
          title={nightMode ? "Switch to light mode" : "Switch to night mode"}
          onClick={() => setNightMode((enabled) => !enabled)}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
            {nightMode ? (
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
            ) : (
              <path
                d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {nightMode && (
              <path
                d="M12 2v2m0 16v2m10-10h-2M4 12H2m17.07 7.07-1.42-1.42M6.35 6.35 4.93 4.93m14.14 0-1.42 1.42M6.35 17.65l-1.42 1.42"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
        <button
          className="navbar__toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
