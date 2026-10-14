import { useCallback, useEffect, useState, type ReactNode } from "react";
import * as authApi from "../services/auth";
import type { AuthSession } from "../types";
import { AuthContext } from "./AuthContext";
import { UNAUTHORIZED_EVENT, clearSession, getTokenExpiry, loadSession, saveSession } from "./storage";

// setTimeout can't wait longer than ~24.8 days.
const MAX_TIMEOUT_MS = 2_147_483_647;

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthSession | null>(() => loadSession());

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  // The API layer announces rejected tokens (expired / tampered).
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout);
  }, [logout]);

  // Sign out automatically when the token expires, even if the tab stays open.
  useEffect(() => {
    if (!user) return;
    const expiresAt = getTokenExpiry(user.token);
    if (expiresAt === null) return;
    const delay = Math.min(Math.max(expiresAt - Date.now(), 0), MAX_TIMEOUT_MS);
    const timer = window.setTimeout(logout, delay);
    return () => window.clearTimeout(timer);
  }, [user, logout]);

  const startSession = useCallback((session: AuthSession) => {
    saveSession(session);
    setUser(session);
    return session;
  }, []);

  const login = useCallback(
    async (input: authApi.LoginInput) => startSession(await authApi.login(input)),
    [startSession],
  );

  const register = useCallback(
    async (input: authApi.RegisterInput) => startSession(await authApi.register(input)),
    [startSession],
  );

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}
