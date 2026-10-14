// ---- Shapes returned by the ASP.NET Core API (camelCase JSON) ----

export type CatalogStatus = "open" | "coming-soon" | "closed" | "draft";

export interface PagedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Category {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  title: string;
  shortDescription: string | null;
  imageUrl: string | null;
  duration: string | null;
  location: string | null;
  price: number;
  status: CatalogStatus;
  categoryName: string;
  instructorName: string;
}

export interface CourseDetail {
  id: number;
  title: string;
  shortDescription: string | null;
  fullDescription: string | null;
  imageUrl: string | null;
  duration: string | null;
  schedule: string | null;
  location: string | null;
  price: number;
  status: CatalogStatus;
  type: string | null;
  categoryId: number;
  categoryName: string;
  instructorId: number;
  instructorName: string;
}

export interface Program {
  id: number;
  title: string;
  overview: string | null;
  price: number;
  status: CatalogStatus;
  courseCount: number;
}

export interface ProgramDetail {
  id: number;
  title: string;
  overview: string | null;
  requirements: string | null;
  duration: string | null;
  location: string | null;
  price: number;
  status: CatalogStatus;
  categoryName: string;
  includedCourses: Course[];
}

export interface CareerPath {
  id: number;
  title: string;
  description: string | null;
  recommendedSkills: string | null;
}

export interface CareerPathDetail extends CareerPath {
  relatedPrograms: Program[];
  recommendedCourses: Course[];
}

// ---- Auth, applications and payments (Sprint 3) ----

export type Role = "Admin" | "Instructor" | "ContentManager" | "Learner";

/** Response of POST /api/auth/login and /api/auth/register. */
export interface AuthSession {
  token: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface UserProfile {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  country: string | null;
  role: Role;
}

export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface Application {
  id: number;
  courseId: number | null;
  courseTitle: string | null;
  programId: number | null;
  programTitle: string | null;
  status: ApplicationStatus;
  appliedAt: string;
  amount: number;
}

export interface Payment {
  id: number;
  applicationId: number;
  amount: number;
  status: string;
  method: string | null;
  paidAt: string | null;
}

// ---- Static homepage content (no API for these yet — CMS comes in the final sprint) ----

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface Partner {
  id: number;
  name: string;
  logo: string;
}
