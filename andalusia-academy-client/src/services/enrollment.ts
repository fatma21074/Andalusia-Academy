import type { Application, Payment } from "../types";
import { postJson } from "./api";

export type ApplicationTarget = { courseId: number } | { programId: number };

export const createApplication = (target: ApplicationTarget) =>
  postJson<Application>("/api/applications", target);

// The API only supports the simulated payment for now.
export const payApplication = (applicationId: number) =>
  postJson<Payment>("/api/payments", { applicationId, method: "simulation" });

export const myApplicationsUrl = () => "/api/applications/my";
export const myPaymentsUrl = () => "/api/payments/my";
