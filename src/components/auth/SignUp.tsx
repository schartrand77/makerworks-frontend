import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const registerUrl = import.meta.env.VITE_AUTHENTIK_REGISTER_URL;

  const handleSignUp = () => {
    if (!registerUrl) {
      console.error(
        "Missing VITE_AUTHENTIK_REGISTER_URL — cannot redirect to Authentik."
      );
      return;
    }

    setLoading(true);
    console.debug("[SignUp] Redirecting to:", registerUrl);
    window.location.href = registerUrl;
  };

  const envValid = !!registerUrl;

  return (
    <PageLayout title="Sign Up">
      <div className="glass-card p-8 text-center">
        <h1 className="text-xl font-semibold mb-4">Join MakerWorks</h1>
        <p className="text-muted-foreground mb-6">
          Click below to create your account.
        </p>
        <button
          className="btn btn-primary"
          onClick={handleSignUp}
          disabled={!envValid || loading}
        >
          {loading ? "Redirecting…" : "Sign up with Authentik"}
        </button>
        {!envValid && (
          <p className="text-xs text-red-500 mt-2">
            Missing Authentik registration URL.
          </p>
        )}
      </div>
    </PageLayout>
  );
};

export default SignUp;
