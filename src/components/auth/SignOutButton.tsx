import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

type SignOutButtonProps = {
  className?: string;
};

/**
 * Logs the user out from MakerWorks & Authentik.
 * Calls useAuthStore().logout(), then redirects to Authentik logout URL.
 */
export default function SignOutButton({ className = "" }: SignOutButtonProps) {
  const [loading, setLoading] = useState(false);
  const logout = useAuthStore((s) => s.logout);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      logout(); // Zustand clears token + user
    } finally {
      setLoading(false);

      const AUTHENTIK_BASE = import.meta.env.VITE_AUTHENTIK_BASE_URL;
      const NEXT_URL = window.location.origin;

      if (!AUTHENTIK_BASE) {
        console.error(
          "Missing VITE_AUTHENTIK_BASE_URL — cannot redirect to Authentik logout."
        );
        return;
      }

      const logoutUrl =
        `${AUTHENTIK_BASE}/application/o/logout/` +
        `?next=${encodeURIComponent(NEXT_URL)}`;

      console.debug("[SignOutButton] Redirecting to:", logoutUrl);
      window.location.href = logoutUrl;
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`px-4 py-2 text-sm rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition text-zinc-800 dark:text-white disabled:opacity-50 ${className}`}
    >
      {loading ? "Signing out…" : "Sign Out"}
    </button>
  );
}
