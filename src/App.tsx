// src/App.tsx
import { useEffect, useState } from 'react';
import { useSessionRefresh } from '@/hooks/useSessionRefresh';
import GlassNavbar from '@/components/ui/GlassNavbar';
import RoutesRenderer from '@/routes';
import { useAuthStore } from '@/store/useAuthStore';

function AppContent() {
  return (
    <div className="pt-16">
      <RoutesRenderer />
    </div>
  );
}

export default function App() {
  const token = useAuthStore((s) => s.token);
  const { setUser, fetchUser, setResolved, resolved } = useAuthStore.getState();
  useSessionRefresh();

  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    // Watch for theme changes (ThemeSection toggles .dark on <html>)
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let mounted = true;

    const runAuthFetch = async () => {
      try {
        const u = await fetchUser(true);
        if (!u && mounted) {
          console.warn('[App.tsx] 🚫 No user returned from fetchUser');
          typeof setUser === 'function' && setUser(null);
        } else if (u) {
          console.info('[App.tsx] ✅ User fetched successfully:', u);
        }
      } catch (err) {
        console.error('[App.tsx] ❌ Error in fetchUser:', err);
        if (mounted && typeof setUser === 'function') {
          setUser(null);
        }
      } finally {
        if (mounted && typeof setResolved === 'function' && !resolved) {
          setResolved(true);
        }
      }
    };

    runAuthFetch();
    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark
          ? 'bg-gradient-to-br from-black via-[#0D0D1A] via-[#1A0D2E] via-[#1E1E4F] via-[#2A2A5C] via-[#3A3A6E] via-[#4B4B7F] via-[#5C5C8F] via-[#6E6E9F] to-gray-800 text-white'
          : 'bg-gradient-to-br from-white via-[#FFE6F0] via-[#FFD6CC] via-[#FFE0B3] via-[#FFF2B3] via-[#E6FFCC] via-[#CCFFE6] via-[#D6F5FF] via-[#E6E6FF] to-[#FFFDF7] text-gray-900'
      }`}
    >
      <GlassNavbar />
      <AppContent />
    </div>
  );
}
