import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import PageLayout from "@/components/layout/PageLayout";

const SignIn = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const AUTHENTIK_BASE = import.meta.env.VITE_AUTHENTIK_BASE_URL;
  const CLIENT_ID = import.meta.env.VITE_AUTHENTIK_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_AUTHENTIK_REDIRECT_URI;

  const envVarsValid = AUTHENTIK_BASE && CLIENT_ID && REDIRECT_URI;

  const params = new URLSearchParams(location.search);
  const error = params.get("error");

  useEffect(() => {
    if (user) {
      console.info("[SignIn] User already logged in — redirecting to /dashboard");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSignIn = () => {
    if (!envVarsValid) {
      console.error(
        "[SignIn] Missing required Authentik environment variables:\n" +
          `VITE_AUTHENTIK_BASE_URL: ${AUTHENTIK_BASE}\n` +
          `VITE_AUTHENTIK_CLIENT_ID: ${CLIENT_ID}\n` +
          `VITE_AUTHENTIK_REDIRECT_URI: ${REDIRECT_URI}`
      );
      alert("Configuration error. Please contact support.");
      return;
    }

    const state = crypto.randomUUID();

    try {
      localStorage.setItem("auth_state", state);
      console.debug("[SignIn] Stored auth_state in localStorage:", state);
    } catch (err) {
      console.error("[SignIn] Failed to store auth_state in localStorage", err);
      alert("Unable to store login state. Please try a different browser.");
      return;
    }

    const authUrl = new URL(`${AUTHENTIK_BASE}/application/o/authorize/`);
    authUrl.searchParams.append("client_id", CLIENT_ID);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", "openid profile email");
    authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.append("state", state);

    const finalUrl = authUrl.toString();
    console.info("[SignIn] Redirecting to Authentik with URL:", finalUrl);

    window.location.href = finalUrl;
  };

  const renderErrorMessage = () => {
    switch (error) {
      case "invalid_state":
        return "Invalid authentication state. Please try again.";
      case "missing_code":
        return "No authorization code. Please try again.";
      case "token_failed":
        return "Sign-in failed. Please try again.";
      default:
        return null;
    }
  };

  return (
    <PageLayout title="Sign In">
      <div className="glass-card p-8 text-center">
        <h1 className="text-xl font-semibold mb-4">Welcome Back</h1>
        <p className="text-muted-foreground mb-6">
          Click below to sign in with Authentik.
        </p>

        {error && (
          <p className="text-red-500 mb-4">{renderErrorMessage()}</p>
        )}

        <button
          className="btn btn-primary"
          onClick={handleSignIn}
          disabled={!envVarsValid}
        >
          Sign in with Authentik
        </button>

        {!envVarsValid && (
          <p className="text-xs text-red-500 mt-2">
            Missing Authentik configuration.
          </p>
        )}
      </div>
    </PageLayout>
  );
};

export default SignIn;
