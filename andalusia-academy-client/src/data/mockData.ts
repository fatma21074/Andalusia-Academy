import type { Testimonial, Partner } from "../types";

// Courses, programs, career paths and categories now come from the API (Sprint 2).
// Testimonials and partners stay static until the CMS work in the final sprint.

export const testimonials: Testimonial[] = [
  { id: 1, name: "Fatma", role: "Graduate, Full-Stack Track", quote: "The hands-on projects made the difference — I was job-ready before I finished.", avatar: "/img/avatar1.JPG" },
  { id: 2, name: "Malak", role: "Graduate, Data Track", quote: "Instructors were available and the material stayed practical throughout.", avatar: "/img/avatar2.jpg" },
];

export const partners: Partner[] = [
  { id: 1, name: "Digital Egypt Pioneers", logo: "/img/partner1.png" },
  { id: 2, name: "TechCorp", logo: "/img/partner2.jpg" },
];
