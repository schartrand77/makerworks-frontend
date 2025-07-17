// src/components/ui/GlassNavbar.tsx
import { Link, useLocation } from 'react-router-dom';
import UserDropdown from '@/components/ui/UserDropdown';
import { useAuthStore } from '@/store/useAuthStore';

const GlassNavbar = () => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  const navRoutes = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/browse', label: 'Browse' },
    { path: '/estimate', label: 'Estimate' },
    { path: '/upload', label: 'Upload' },
    { path: '/cart', label: 'Cart' },
    { path: '/checkout', label: 'Checkout' },
  ];

  return (
    <nav
      className={`
        fixed
        top-4
        left-1/2
        transform -translate-x-1/2
        flex justify-between items-center
        gap-6
        px-6 py-2
        rounded-full
        bg-white/30 dark:bg-black/30
        backdrop-blur-md
        shadow-md
        z-50
      `}
    >
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="text-lg font-bold text-gray-800 dark:text-white"
        >
          MakerW⚙️rks
        </Link>

        {navRoutes.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                text-sm
                px-3 py-1
                rounded-full
                backdrop-blur
                bg-blue-200/40 dark:bg-blue-300/20
                text-blue-700 dark:text-blue-200
                border border-blue-300
                shadow
                transition
                hover:bg-blue-300/50 dark:hover:bg-blue-400/30
                ${isActive ? 'bg-blue-500 text-white' : ''}
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated() ? (
          <UserDropdown user={user} />
        ) : (
          <Link
            to="/auth/signin"
            className={`
              text-sm
              px-3 py-1
              rounded-full
              backdrop-blur
              bg-blue-200/40 dark:bg-blue-300/20
              text-blue-700 dark:text-blue-200
              border border-blue-300
              shadow
              hover:bg-blue-300/50 dark:hover:bg-blue-400/30
              transition
            `}
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default GlassNavbar;
