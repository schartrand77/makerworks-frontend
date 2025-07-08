import { Link, useLocation } from 'react-router-dom';
import UserDropdown from '@/components/ui/UserDropdown';
import { useAuthStore } from '@/store/useAuthStore';

const GlassNavbar = () => {
  const { user, isAuthenticated } = useAuthStore();
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
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-3 
      bg-white/30 dark:bg-black/30 backdrop-blur-md shadow-md z-50 glass-navbar">
      
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-xl font-bold text-gray-800 dark:text-white"
        >
          MakerWorks
        </Link>

        {navRoutes.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition 
              ${location.pathname === item.path ? 'font-semibold underline' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div>
        {isAuthenticated() ? (
          <UserDropdown user={user} />
        ) : (
          <Link
            to="/auth/signin"
            className="px-4 py-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition shadow"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default GlassNavbar;