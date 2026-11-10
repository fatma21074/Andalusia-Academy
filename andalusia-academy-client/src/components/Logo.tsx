import { Link } from "react-router-dom";
import "./Logo.css";

export default function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" className="logo" onClick={onClick} aria-label="Andalusia Academy home">
      <img className="logo__icon" src="/img/LOGO.png" alt="" />
      <span className="logo__text">Andalusia</span>
    </Link>
  );
}
