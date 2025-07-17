import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleAuthCallback } from "@/api/authCallback";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const returnedState = params.get("state") || "";
    const expectedState = localStorage.getItem("auth_state");

    console.debug("[AuthCallbackPage] Returned state:", returnedState);
    console.debug("[AuthCallbackPage] Expected state:", expectedState);

    if (!code) {
      console.error("[AuthCallbackPage] No authorization code found in URL");
      navigate("/auth/signin?error=missing_code");
      return;
    }

    if (!returnedState || returnedState !== expectedState) {
      console.error("[AuthCallbackPage] Invalid or missing state parameter", {
        returnedState,
        expectedState,
      });
      localStorage.removeItem("auth_state");
      navigate("/auth/signin?error=invalid_state");
      return;
    }

    // State validated — remove it now
    localStorage.removeItem("auth_state");

    handleAuthCallback(code)
      .then(() => {
        console.info("[AuthCallbackPage] Authentication successful. Redirecting to dashboard.");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("[AuthCallbackPage] Auth callback failed", err);
        navigate("/auth/signin?error=token_failed");
      });
  }, [navigate, location]);

  return (
    <div className="glass-card p-8 text-center">
      <h2 className="text-xl font-semibold">Signing you in…</h2>
    </div>
  );
}
