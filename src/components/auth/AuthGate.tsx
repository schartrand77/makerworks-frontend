import { Navigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { ReactNode, useEffect } from "react";

type AuthGateProps = {
  children: ReactNode;
  requiredRoles?: string[]; // support multiple roles
  fallback?: ReactNode;     // optional fallback while loading
};

export default function AuthGate({
  children,
  requiredRoles,
  fallback,
}: AuthGateProps): JSX.Element | null {
  const { user, loading } = useUser();

  useEffect(() => {
    console.debug("[AuthGate] User:", user);
    console.debug("[AuthGate] Required Roles:", requiredRoles);
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
    console.warn("[AuthGate] No user found. Redirecting to /auth/signin");
    return <Navigate to="/auth/signin" replace />;
  }

  if (
    requiredRoles &&
    (!Array.isArray(user.groups) ||
      !requiredRoles.some((role) => user.groups?.includes(role)))
  ) {
    console.warn(
      `[AuthGate] User lacks required roles [${requiredRoles.join(
        ", "
      )}]. Redirecting to /unauthorized`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
