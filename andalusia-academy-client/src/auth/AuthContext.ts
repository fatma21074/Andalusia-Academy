import { createContext } from "react";
import type { AuthSession } from "../types";
import type { LoginInput, RegisterInput } from "../services/auth";

export interface AuthContextValue {
  /** The signed-in user (with token), or null when signed out. */
  user: AuthSession | null;
  login: (input: LoginInput) => Promise<AuthSession>;
  register: (input: RegisterInput) => Promise<AuthSession>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
