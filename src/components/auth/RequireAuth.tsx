import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Guards a route, redirecting unauthenticated users to fallback
 * and unauthorized users (wrong role) to /unauthorized.
 */
const RequireAuth = ({
  children,
  requiredRoles,
  fallbackTo = '/', // fallback for unauthenticated
}: {
  children: JSX.Element;
  requiredRoles?: string[];
  fallbackTo?: string;
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // check session-based auth state
  if (!isAuthenticated()) {
    console.info(
      '[RequireAuth] User is not authenticated → redirecting to fallback.',
      { fallbackTo, from: location.pathname }
    );
    return (
      <Navigate
        to={fallbackTo}
        state={{ from: location }}
        replace
      />
    );
  }

  const userRole = user?.role;

  if (requiredRoles && (!userRole || !requiredRoles.includes(userRole))) {
    console.info(
      `[RequireAuth] Authenticated but role "${userRole}" not in [${requiredRoles.join(
        ', '
      )}] → redirecting to /unauthorized.`,
      { from: location.pathname }
    );
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
