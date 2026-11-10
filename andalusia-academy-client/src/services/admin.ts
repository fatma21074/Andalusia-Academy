import { deleteJson, postJson, putJson } from "./api";
import type { CatalogStatus, CourseDetail } from "../types";

export const adminUsersUrl = () => "/api/admin/users";
/** Needs a backend endpoint that lists instructors; the course form falls back to a typed ID until it exists. */
export const adminInstructorsUrl = () => "/api/admin/instructors";

export const COURSE_STATUSES: { value: CatalogStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "open", label: "Open" },
  { value: "coming-soon", label: "Coming soon" },
  { value: "closed", label: "Closed" },
];

export interface CourseAdminInput {
  title: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  duration: string;
  location: string;
  price: number;
  categoryId: number;
  instructorId: number;
  status: CatalogStatus;
}

// The API starts every new course as a draft and ignores `status` on create.
export const createAdminCourse = (body: CourseAdminInput) => postJson<CourseDetail>("/api/admin/courses", body);
export const updateAdminCourse = (id: number, body: CourseAdminInput) =>
  putJson<CourseDetail>(`/api/admin/courses/${id}`, body);
export const deleteAdminCourse = (id: number) => deleteJson(`/api/admin/courses/${id}`);
