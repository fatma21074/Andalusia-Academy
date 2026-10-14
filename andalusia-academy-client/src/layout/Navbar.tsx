import { useState } from "react";
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
  const close = () => setOpen(false);

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
