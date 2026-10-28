import type { Application } from "../types";
import { postJson } from "./api";

export type ApplicationTarget = { courseId: number } | { programId: number };

export const createApplication = (target: ApplicationTarget) =>
  postJson<Application>("/api/applications", target);

// Starts a Kashier checkout session. The browser is then sent to `checkoutUrl` to pay.
export const startCheckout = (applicationId: number) =>
  postJson<{ checkoutUrl: string }>("/api/payments", {
    applicationId,
    method: "kashier",
  });

export const myApplicationsUrl = () => "/api/applications/my";
export const myPaymentsUrl = () => "/api/payments/my";
