import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

type SignOutButtonProps = {
  className?: string;
};

/**
 * Logs the user out from the frontend and redirects them to Authentik's logout URL.
 * Calls useAuthStore().logout() directly.
 */
export default function SignOutButton({ className = "" }: SignOutButtonProps) {
  const [loading, setLoading] = useState(false);
  const logout = useAuthStore((s) => s.logout);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
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
