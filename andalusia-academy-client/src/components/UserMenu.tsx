import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import "./UserMenu.css";

export default function UserMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function handlePointer(e: MouseEvent) {
      if (container.current && !container.current.contains(e.target as Node))
        setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (!user) return null;

  function close() {
    setOpen(false);
    onNavigate?.();
  }

  function handleLogout() {
    logout();
    close();
    navigate("/");
  }

  return (
    <div className="user-menu" ref={container}>
      <button
        type="button"
        className="user-menu__toggle"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="user-menu__avatar" aria-hidden="true">
          {user.firstName.charAt(0).toUpperCase()}
        </span>
        <span className="user-menu__name">{user.firstName}</span>
      </button>
      {open && (
        <ul className="user-menu__list" role="menu">
          <li role="none">
            <Link role="menuitem" to="/profile" onClick={close}>
              My profile
            </Link>
          </li>
          <li role="none">
            <Link role="menuitem" to="/notifications" onClick={close}>
              Notifications
            </Link>
          </li>
          {user.role === "Learner" && (
            <>
              <li role="none">
                <Link role="menuitem" to="/my-courses" onClick={close}>
                  My courses
                </Link>
              </li>
              <li role="none">
                <Link role="menuitem" to="/my-applications" onClick={close}>
                  My applications
                </Link>
              </li>
              <li role="none">
                <Link role="menuitem" to="/my-payments" onClick={close}>
                  My payments
                </Link>
              </li>
            </>
          )}
          {user.role === "Instructor" && (
            <li role="none">
              <Link role="menuitem" to="/instructor" onClick={close}>
                Instructor dashboard
              </Link>
            </li>
          )}
          {user.role === "Admin" && (
            <li role="none">
              <Link role="menuitem" to="/admin" onClick={close}>
                Admin dashboard
              </Link>
            </li>
          )}
          {user.role === "Admin" && (
            <li role="none">
              <Link role="menuitem" to="/admin/content" onClick={close}>
                Website content
              </Link>
            </li>
          )}
          <li role="none">
            <button type="button" role="menuitem" onClick={handleLogout}>
              Sign out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
