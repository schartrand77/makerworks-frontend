import GlassNavbar from '@/components/ui/GlassNavbar';
import RoutesRenderer from '@/routes';

function AppContent() {
  return (
    <div className="pt-16">
      <RoutesRenderer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <GlassNavbar />
      <AppContent />
    </>
  );
}