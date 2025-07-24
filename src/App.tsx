import { useEffect } from "react";
import { useSessionRefresh } from "@/hooks/useSessionRefresh";
import GlassNavbar from "@/components/ui/GlassNavbar";
import RoutesRenderer from "@/routes";
import { useAuthStore } from "@/store/useAuthStore";

function AppContent() {
  return (
    <div className="pt-16">
      <RoutesRenderer />
    </div>
  );
}

export default function App() {
  const user = useAuthStore((s) => s.user);
  const { setUser, fetchUser } = useAuthStore.getState(); // ✅ fixed
  useSessionRefresh();

  useEffect(() => {
    const runAuthFetch = async () => {
      if (!user && typeof fetchUser === "function") {
        try {
          const u = await fetchUser();
          if (!u) {
            console.warn(
              "[App.tsx] 🚫 No user returned from fetchUser — clearing auth state"
            );
            if (typeof setUser === "function") {
              setUser(null);
            }
          } else {
            console.info("[App.tsx] ✅ User fetched successfully:", u);
          }
        } catch (err) {
          console.error("[App.tsx] ❌ Error in fetchUser:", err);
          if (typeof setUser === "function") {
            setUser(null);
          }
        }
      } else if (typeof fetchUser !== "function") {
        console.warn("[App.tsx] ⚠️ fetchUser is not defined");
        if (typeof setUser === "function") {
          setUser(null);
        }
      }
    };

    runAuthFetch();
  }, [user]); // ✅ only track 'user'

  return (
    <>
      <GlassNavbar />
      <AppContent />
    </>
  );
}
