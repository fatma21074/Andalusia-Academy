import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__col">
          <h3>Andalusia Academy</h3>
          <p>Practical, career-focused learning built with local instructors and real projects.</p>
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <ul>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/programs">Programs</a></li>
            <li><a href="/career-paths">Career Paths</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Company</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact & Support</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Contact</h4>
          <p>info@andalusia-academy.com</p>
          <p>+20 100 000 0000</p>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Andalusia Academy. All rights reserved.</span>
      </div>
    </footer>
  );
}
