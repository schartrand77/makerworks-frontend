import { useEffect } from 'react';
import GlassNavbar from '@/components/ui/GlassNavbar';
import RoutesRenderer from '@/routes';
import { ToastProvider } from '@/context/ToastProvider';
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
  const fetchUser = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);

  return (
    <ToastProvider>
      <GlassNavbar />
      <AppContent />
    </ToastProvider>
  );
}
