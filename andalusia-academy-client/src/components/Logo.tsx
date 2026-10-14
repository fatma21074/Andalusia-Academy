import { Link } from "react-router-dom";
import "./Logo.css";

export default function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" className="logo" onClick={onClick} aria-label="Andalusia Academy home">
      <svg className="logo__icon" viewBox="0 0 32 32" width="34" height="34" aria-hidden="true">
        <path d="M16 4 2 11l14 7 14-7-14-7Z" fill="currentColor" />
        <path d="M8 15.5V21c0 2 3.6 4.5 8 4.5s8-2.5 8-4.5v-5.5L16 20l-8-4.5Z" fill="currentColor" opacity="0.75" />
      </svg>
      <span className="logo__text">Andalusia</span>
    </Link>
  );
}
