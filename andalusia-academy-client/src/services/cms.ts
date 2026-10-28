import { deleteJson, postJson, putJson } from "./api";
import type { Faq, Partner, Testimonial } from "../types";

// Public, published content.
export const testimonialsUrl = () => "/api/testimonials";
export const partnersUrl = () => "/api/partners";
export const faqsUrl = () => "/api/faqs";

export interface TestimonialInput {
  userId: number;
  quote: string;
  displayRole: string;
  isPublished: boolean;
}

export interface PartnerInput {
  name: string;
  logoUrl: string;
  websiteUrl: string;
  isPublished: boolean;
}

export interface FaqInput {
  question: string;
  answer: string;
  displayOrder: number;
  isPublished: boolean;
}

function adminResource<T, I>(path: string) {
  return {
    url: () => path,
    create: (body: I) => postJson<T>(path, body),
    update: (id: number, body: I) => putJson<T>(`${path}/${id}`, body),
    remove: (id: number) => deleteJson(`${path}/${id}`),
  };
}

// Admin: every item, published or not.
export const adminTestimonials = adminResource<Testimonial, TestimonialInput>(
  "/api/admin/testimonials",
);
export const adminPartners = adminResource<Partner, PartnerInput>(
  "/api/admin/partners",
);
export const adminFaqs = adminResource<Faq, FaqInput>("/api/admin/faqs");
