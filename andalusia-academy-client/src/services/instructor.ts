import { postJson } from "./api";

export const instructorCoursesUrl = () => "/api/instructor/my-courses";
export const instructorStudentsUrl = (courseId: number) => `/api/instructor/courses/${courseId}/students`;
export const instructorSubmissionsUrl = (assignmentId: number) =>
  `/api/instructor/assignments/${assignmentId}/submissions`;
/** Needs a backend endpoint that lists a course's assignments; the dashboard falls back to a typed ID until it exists. */
export const instructorAssignmentsUrl = (courseId: number) => `/api/instructor/courses/${courseId}/assignments`;

export interface AssignmentInput {
  title: string;
  description: string;
  dueDate: string | null;
}

export const createInstructorAssignment = (courseId: number, body: AssignmentInput) =>
  postJson(`/api/instructor/courses/${courseId}/assignments`, body);

export interface GradeInput {
  score: number;
  feedback: string;
}

export const gradeInstructorSubmission = (submissionId: number, body: GradeInput) =>
  postJson(`/api/instructor/submissions/${submissionId}/grade`, body);
