// src/pages/Landing.tsx
import { useEffect, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useDevModeStore } from '@/store/useDevModeStore';


const Landing: React.FC = () => {
  const resolved = useAuthStore((s) => !!s.user || !!s.token);
  const loading = false; // you can replace with proper loading state if desired
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const enableDevMode = useDevModeStore((s) => s.enable);

  const [printedLetters, setPrintedLetters] = useState('');
  const fullText = 'MakerWorks';
  const [nozzlePosition, setNozzlePosition] = useState(0);
  const [finished, setFinished] = useState(false);
  const [ripple, setRipple] = useState(false);
  const [spinningIndexes, setSpinningIndexes] = useState<number[]>([]);

  useEffect(() => {
    if (!resolved && !loading) {
      fetchUser?.();
    }
  }, [resolved, loading, fetchUser]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
        enableDevMode();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enableDevMode]);

  useEffect(() => {
    if (!loading && isAuthenticated()) {
      window.location.href = '/dashboard';
    }
  }, [loading, user, resolved, isAuthenticated]);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      setPrintedLetters(fullText.slice(0, idx + 1));
      setNozzlePosition(idx);
      idx++;
      if (idx === fullText.length) {
        clearInterval(interval);
        setTimeout(() => setFinished(true), 1000);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!finished) return;
    const rippleInterval = setInterval(() => {
      setRipple(true);
      setTimeout(() => setRipple(false), 1000);
    }, 5000);
    return () => clearInterval(rippleInterval);
  }, [finished]);

  useEffect(() => {
    if (!finished) return;
    const spinInterval = setInterval(() => {
      const howMany = Math.ceil(Math.random() * 3);
      const indices = new Set<number>();
      while (indices.size < howMany) {
        indices.add(Math.floor(Math.random() * fullText.length));
      }
      setSpinningIndexes(Array.from(indices));
      setTimeout(() => setSpinningIndexes([]), 1000);
    }, 7000);
    return () => clearInterval(spinInterval);
  }, [finished]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <GlassCard>
        <div className="flex flex-col items-center text-center relative">
          <div className="relative h-12 w-full flex justify-center">
            <h1
              className={`text-3xl font-bold mb-2 tracking-widest relative transition-transform duration-500 ${
                ripple ? 'ripple' : ''
              }`}
            >
              <span className="inline-block relative">
                {printedLetters.split('').map((char, i) => (
                  <span
                    key={i}
                    className={`inline-block ${
                      spinningIndexes.includes(i) ? 'spin' : ''
                    }`}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </h1>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`w-6 h-6 absolute -top-6 transition-all duration-700 ease-out`}
              style={{
                transform: finished
                  ? `translateX(0)`
                  : `translateX(${nozzlePosition * 1.8}ch)`,
                opacity: finished ? 0 : 1,
              }}
            >
              <rect x="9" y="0" width="6" height="10" fill="#555" />
              <polygon points="12,10 10,14 14,14" fill="#999" />
              <rect x="11" y="14" width="2" height="4" fill="#333" />
            </svg>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Upload, estimate, and manage your 3D print jobs.
          </p>

          {loading ? (
            <p className="text-sm text-zinc-400">Checking authentication status…</p>
          ) : isAuthenticated() ? (
            <p className="text-sm text-zinc-400">Redirecting to dashboard…</p>
          ) : (
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => (window.location.href = '/auth/signin')}
                className="px-6 py-2 bg-blue-300 hover:bg-blue-400 text-black rounded-full text-sm shadow"
              >
                Sign In
              </button>
              <button
                onClick={() => (window.location.href = '/auth/signup')}
                className="px-6 py-2 bg-green-300 hover:bg-green-400 text-black rounded-full text-sm shadow"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </GlassCard>

      <style>
        {`
          .ripple {
            animation: ripple-effect 1s ease-out;
          }
          @keyframes ripple-effect {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
            100% { transform: scale(1); opacity: 1; }
          }

          .spin {
            animation: spin-letter 1s ease-in-out;
            display: inline-block;
          }
          @keyframes spin-letter {
            0% { transform: rotateY(0deg); }
            50% { transform: rotateY(360deg); }
            100% { transform: rotateY(0deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Landing;
