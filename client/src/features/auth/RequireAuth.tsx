import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import type { Role } from "../../config/roles";

interface RequireAuthProps {
  allowedRoles: Role[];
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const location = useLocation();
  const { roles } = useAuth();

  return roles.some((role) => allowedRoles.includes(role as Role)) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
