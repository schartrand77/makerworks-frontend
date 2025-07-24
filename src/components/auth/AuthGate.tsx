import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { ReactNode, useEffect } from 'react';

type AuthGateProps = {
  children: ReactNode;
  requiredRoles?: string[];  // optionally enforce roles
  fallback?: ReactNode;      // optional fallback UI while loading
};

export default function AuthGate({
  children,
  requiredRoles,
  fallback,
}: AuthGateProps): JSX.Element | null {
  const { user, loading } = useUser();
  const location = useLocation();

  useEffect(() => {
    console.debug('[AuthGate] Current user:', user);
    console.debug('[AuthGate] Required roles:', requiredRoles);
  }, [user, requiredRoles]);

  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg font-medium text-muted-foreground animate-pulse">
            Checking your access…
          </div>
        </div>
      )
    );
  }

  if (!user) {
    console.warn(
      '[AuthGate] No user session found → redirecting to /auth/signin',
      { from: location.pathname }
    );
    return (
      <Navigate
        to="/auth/signin"
        state={{ from: location }}
        replace
      />
    );
  }

  const groups: string[] = Array.isArray(user.groups) ? user.groups : [];
  if (requiredRoles && !requiredRoles.some((r) => groups.includes(r))) {
    console.warn(
      `[AuthGate] User groups ${JSON.stringify(groups)} lack required roles [${requiredRoles.join(
        ', '
      )}] → redirecting to /unauthorized`,
      { from: location.pathname }
    );
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
