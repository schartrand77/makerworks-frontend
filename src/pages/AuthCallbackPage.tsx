// src/pages/AuthCallbackPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleAuthCallback } from "@/api/authCallback";

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      console.error("No code found in URL.");
      navigate("/");
      return;
    }

    handleAuthCallback(code)
      .then(() => navigate("/dashboard"))
      .catch((err) => {
        console.error("Auth callback failed", err);
        navigate("/login");
      });
  }, [navigate]);

  return <p>Processing login…</p>;
}
