import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

type UseSignOutResult = {
  disabled: boolean;
  signOut: () => void;
};

/**
 * Handles signing out both locally (Zustand) and remotely (Authentik).
 * Sets a disabled flag to prevent repeated clicks during the process.
 */
export const useSignOut = (): UseSignOutResult => {
  const logout = useAuthStore((s) => s.logout);
  const [disabled, setDisabled] = useState(false);

  const signOut = () => {
    if (disabled) {
      console.warn("[useSignOut] Already signing out — ignored.");
      return;
    }

    setDisabled(true);
    console.info("[useSignOut] 🔒 Signing out…");

    logout();

    const AUTHENTIK_LOGOUT_URL =
      import.meta.env.VITE_AUTHENTIK_LOGOUT_URL?.trim();

    if (!AUTHENTIK_LOGOUT_URL) {
      console.error(
        "[useSignOut] ❌ Missing VITE_AUTHENTIK_LOGOUT_URL — cannot redirect."
      );
      setDisabled(false);
      return;
    }

    console.info("[useSignOut] Redirecting to:", AUTHENTIK_LOGOUT_URL);
    window.location.href = AUTHENTIK_LOGOUT_URL;
  };

  return {
    disabled,
    signOut,
  };
};
