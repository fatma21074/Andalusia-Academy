import { useState } from "react";
import PageBanner from "../components/PageBanner";
import Button from "../components/Button";
import "./Contact.css";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Sprint 3+: wire this up to a real "contact" API endpoint.
    setSubmitted(true);
  }

  return (
    <>
      <PageBanner title="Contact & Support" crumbs={[{ label: "Contact" }]} />
      <section className="section contact-page">
        <div className="container">
          <p className="lead">Questions about a course or program? Send us a message and we'll get back to you.</p>
          <div className="contact-page__layout">
            <div className="contact-page__form-col">
              {submitted ? (
                <p className="contact-page__success">Thanks — your message has been sent. We'll reply soon.</p>
              ) : (
                <form className="contact-page__form" onSubmit={handleSubmit}>
                  <div className="contact-page__field">
                    <label htmlFor="name">Full name</label>
                    <input id="name" name="name" type="text" required />
                  </div>
                  <div className="contact-page__field">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" required />
                  </div>
                  <div className="contact-page__field">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" rows={5} required />
                  </div>
                  <Button type="submit" variant="primary">
                    Send Message
                  </Button>
                </form>
              )}
            </div>
            <div className="contact-page__image-col">
              <img
                src="/img/contact-support.avif"
                alt="A friendly support agent with a headset, ready to help you with your questions"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
