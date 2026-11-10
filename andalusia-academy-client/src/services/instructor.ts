import { deleteJson, postForm, postJson } from "./api";
import type {
  AttendanceStatus,
  InstructorMaterial,
  InstructorSession,
  SessionStatus,
} from "../types";

export const instructorCoursesUrl = () => "/api/instructor/my-courses";
export const instructorStudentsUrl = (courseId: number) => `/api/instructor/courses/${courseId}/students`;
export const instructorSubmissionsUrl = (assignmentId: number) =>
  `/api/instructor/assignments/${assignmentId}/submissions`;
export const instructorAssignmentsUrl = (courseId: number) => `/api/instructor/courses/${courseId}/assignments`;
export const instructorSessionsUrl = (courseId: number) => `/api/instructor/courses/${courseId}/sessions`;
export const instructorSessionAttendanceUrl = (sessionId: number) =>
  `/api/instructor/sessions/${sessionId}/attendance`;
export const markInstructorAttendance = (
  sessionId: number,
  entries: { userId: number; status: AttendanceStatus }[],
) =>
  postJson<{ message: string }>(instructorSessionAttendanceUrl(sessionId), {
    entries,
  });
export const instructorMaterialsUrl = (courseId: number) => `/api/instructor/courses/${courseId}/materials`;

export interface AssignmentInput {
  title: string;
  description: string;
  dueDate: string | null;
}

export const createInstructorAssignment = (courseId: number, body: AssignmentInput) =>
  postJson(`/api/instructor/courses/${courseId}/assignments`, body);

export interface CreateSessionInput {
  sessionDate: string;
  startTime: string;
  endTime: string;
  status?: SessionStatus;
}

export const createInstructorSession = (courseId: number, body: CreateSessionInput) =>
  postJson<InstructorSession>(instructorSessionsUrl(courseId), body);

export interface AddLinkMaterialInput {
  title: string;
  url: string;
}

export const addInstructorMaterialLink = (courseId: number, body: AddLinkMaterialInput) =>
  postJson<InstructorMaterial>(`${instructorMaterialsUrl(courseId)}/link`, body);

export const uploadInstructorMaterial = (courseId: number, file: File, title?: string) => {
  const body = new FormData();
  body.append("File", file);
  if (title?.trim()) body.append("Title", title.trim());
  return postForm<InstructorMaterial>(`${instructorMaterialsUrl(courseId)}/file`, body);
};

export const deleteInstructorMaterial = (materialId: number) =>
  deleteJson<{ message: string }>(`/api/instructor/materials/${materialId}`);

export interface GradeInput {
  score: number;
  feedback: string;
}

export const gradeInstructorSubmission = (submissionId: number, body: GradeInput) =>
  postJson(`/api/instructor/submissions/${submissionId}/grade`, body);
