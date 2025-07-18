import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

type UseSignOutResult = {
  disabled: boolean;
  signOut: () => void;
};

/**
 * Handles signing out locally.
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

    setDisabled(false);
  };

  return {
    disabled,
    signOut,
  };
};
