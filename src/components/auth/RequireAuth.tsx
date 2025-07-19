import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Guards a route, redirecting unauthenticated users to fallback
 * and unauthorized users (wrong role) to /unauthorized.
 */
const RequireAuth = ({
  children,
  requiredRoles,
  fallbackTo = "/", // fallback for unauthenticated
}: {
  children: JSX.Element;
  requiredRoles?: string[];
  fallbackTo?: string;
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated()) {
    console.info("[RequireAuth] Not authenticated → redirecting to fallback.");
    return (
      <Navigate
        to={fallbackTo}
        state={{ from: location }}
        replace
      />
    );
  }

  if (
    requiredRoles &&
    (!user?.role || !requiredRoles.includes(user.role))
  ) {
    console.info(
      `[RequireAuth] Authenticated but role "${user?.role}" not in [${requiredRoles.join(
        ", "
      )}] → redirecting to /unauthorized.`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
