import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__col">
          <Logo />
          <p>Practical, career-focused learning built with local instructors and real projects.</p>
        </div>
        <div className="footer__col">
          <h4>Explore</h4>
          <ul>
            <li>
              <Link to="/courses">Courses</Link>
            </li>
            <li>
              <Link to="/programs">Programs</Link>
            </li>
            <li>
              <Link to="/career-paths">Career Paths</Link>
            </li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>Company</h4>
          <ul>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact & Support</Link>
            </li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>Contact</h4>
          <ul>
            <li>
              <address>Allasilky Street, Division 4C/6, New Maadi, Cairo, behind Total Masr gas station</address>
            </li>
            <li>
              <a href="https://andalusiaegypt.com/" target="_blank" rel="noopener noreferrer">
                https://andalusiaegypt.com/
              </a>
            </li>
            <li>
              <a href="tel:16781">16781</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Andalusia Academy. All rights reserved.</span>
      </div>
    </footer>
  );
}
