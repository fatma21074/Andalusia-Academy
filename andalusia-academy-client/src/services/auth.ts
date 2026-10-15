import type { AuthSession } from "../types";
import { postJson } from "./api";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  country?: string;
}

export const login = (input: LoginInput) =>
  postJson<AuthSession>("/api/auth/login", input, { authenticated: false });

export const register = (input: RegisterInput) =>
  postJson<AuthSession>("/api/auth/register", input, { authenticated: false });

export const profileUrl = () => "/api/auth/me";
