import type { Course, Program, CareerPath, Testimonial, Partner, Category } from "../types";

export const featuredCourses: Course[] = [
  { id: 1, title: "Full-Stack .NET Development", category: "Backend", image: "/img/course-dotnet.png", duration: "12 weeks", price: 4500, status: "open" },
  { id: 2, title: "React & TypeScript Essentials", category: "Frontend", image: "/img/course-react.png", duration: "8 weeks", price: 3200, status: "open" },
  { id: 3, title: "Data Analysis with SQL", category: "Data", image: "/img/course-sql.jpg", duration: "6 weeks", price: 2800, status: "open" },
  { id: 4, title: "Cloud Fundamentals (Azure)", category: "Cloud", image: "/img/course-azure.jpg", duration: "10 weeks", price: 3900, status: "coming-soon" },
];

export const comingSoonCourses: Course[] = [
  { id: 5, title: "Advanced React Patterns", category: "Frontend", image: "/img/course-react-adv.png", duration: "6 weeks", price: 3500, status: "coming-soon" },
  { id: 6, title: "Microservices with ASP.NET Core", category: "Backend", image: "/img/course-microservices.jpg", duration: "10 weeks", price: 4800, status: "coming-soon" },
];

export const programs: Program[] = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    description: "From frontend fundamentals to production-ready backend systems.",
    courses: [featuredCourses[0], featuredCourses[1], comingSoonCourses[1]],
    image: "/img/program-fullstack.png",
  },
  {
    id: 2,
    title: "Data & Analytics Track",
    description: "SQL, data modeling, and reporting for real business decisions.",
    courses: [featuredCourses[2]],
    image: "/img/program-data.jpg",
  },
];

export const careerPaths: CareerPath[] = [
  { id: 1, title: "Backend Developer", description: "Build APIs and services that power real applications.", relatedProgramIds: [1] },
  { id: 2, title: "Data Analyst", description: "Turn raw data into decisions teams can act on.", relatedProgramIds: [2] },
];

export const testimonials: Testimonial[] = [
  { id: 1, name: "Fatma", role: "Graduate, Full-Stack Track", quote: "The hands-on projects made the difference — I was job-ready before I finished.", avatar: "/img/avatar1.JPG" },
  { id: 2, name: "Malak", role: "Graduate, Data Track", quote: "Instructors were available and the material stayed practical throughout.", avatar: "/img/avatar2.jpg" },
];

export const partners: Partner[] = [
  { id: 1, name: "Digital Egypt Pioneers", logo: "/img/partner1.png" },
  { id: 2, name: "TechCorp", logo: "/img/partner2.jpg" },
];

export const popularCategories: Category[] = [
  { id: 1, name: "Backend Development" },
  { id: 2, name: "Frontend Development" },
  { id: 3, name: "Data & Analytics" },
  { id: 4, name: "Cloud & DevOps" },
  { id: 5, name: "Cybersecurity" },
  { id: 6, name: "UI/UX Design" },
];
