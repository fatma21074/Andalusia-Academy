import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { Role } from "../types";
import AccessDenied from "../pages/AccessDenied";
import { useAuth } from "./useAuth";

interface ProtectedRouteProps {
  /** When set, only these roles may open the nested routes. */
  roles?: Role[];
}

// Frontend guard for a good experience only: the API enforces the same rules on every endpoint.
export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(user.role)) return <AccessDenied role={user.role} />;

  return <Outlet />;
}
