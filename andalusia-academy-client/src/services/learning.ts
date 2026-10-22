import { postJson } from "./api";

export const myCoursesUrl = () => "/api/learner/my-courses";
export const learnerCourseUrl = (courseId: string | number) => `/api/learner/courses/${courseId}`;

// MVP: learners submit a link (Drive, GitHub, ...). Real file upload can replace this later.
export const submitAssignment = (assignmentId: number, fileUrl: string) =>
  postJson<{ message: string }>(`/api/learner/assignments/${assignmentId}/submit`, { fileUrl });
