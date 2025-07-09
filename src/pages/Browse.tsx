import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import GlassCard from '@/components/ui/GlassCard';
import axios from '@/api/axios';
import { useAuthStore } from '@/store/useAuthStore';

interface Model {
  id: string;
  name: string;
  description: string;
  thumbnail_url?: string;
}

const Browse: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.debug('[Browse] Component mounted');

    fetchModels();
    fetchFavorites();
  }, []);

  const loading = models.length === 0 && !error;

  const fetchModels = async () => {
    try {
      console.debug('[Browse] Fetching models from backend…');
      const res = await axios.get<Model[]>('/api/models');
      setModels(res.data);
      console.debug('[Browse] Models loaded:', res.data);
    } catch (err) {
      console.error('[Browse] Failed to fetch models:', err);
      setError('⚠️ Failed to load models. Please try again later.');
    }
  };

  const fetchFavorites = async () => {
    if (!user?.id) return;
    try {
      console.debug('[Browse] Fetching favorites…');
      const res = await axios.get<string[]>(`/api/users/${user.id}/favorites`);
      setFavorites(new Set(res.data));
      console.debug('[Browse] Favorites loaded:', res.data);
    } catch (err) {
      console.error('[Browse] Failed to load favorites:', err);
    }
  };

  const toggleFavorite = async (id: string) => {
    const isFav = favorites.has(id);
    setFavorites(prev => {
      const next = new Set(prev);
      isFav ? next.delete(id) : next.add(id);
      return next;
    });

    try {
      if (isFav) {
        await axios.delete(`/api/users/${user?.id}/favorites/${id}`);
        console.debug('[Browse] Removed favorite:', id);
      } else {
        await axios.post(`/api/users/${user?.id}/favorites`, { modelId: id });
        console.debug('[Browse] Added favorite:', id);
      }
    } catch (err) {
      console.error('[Browse] Failed to update favorite:', err);
    }
  };

  const handleEstimate = (model: Model) => {
    navigate('/estimate', { state: { model } });
  };

  return (
    <>
      <PageLayout title="Browse Models" maxWidth="xl">
        {loading && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <GlassCard key={idx}>
                <div className="animate-pulse space-y-2">
                  <div className="w-full h-40 bg-zinc-200 dark:bg-zinc-700 rounded-md" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-8">{error}</div>
        )}

        {!loading && !error && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {models.map(model => (
              <GlassCard key={model.id} className="relative">
                <button
                  onClick={() => toggleFavorite(model.id)}
                  className="absolute top-2 right-2 text-yellow-400 hover:scale-110 transition"
                  aria-label="Favorite"
                >
                  {favorites.has(model.id) ? '★' : '☆'}
                </button>

                {model.thumbnail_url ? (
                  <img
                    src={model.thumbnail_url}
                    alt={model.name}
                    className="rounded-md mb-2 w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center rounded-md mb-2 text-sm text-zinc-400">
                    No Thumbnail
                  </div>
                )}

                <h2 className="text-lg font-semibold mb-1">{model.name}</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  {model.description}
                </p>

                <button
                  className="mt-2 w-full py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition text-sm"
                  onClick={() => handleEstimate(model)}
                >
                  Get Estimate
                </button>
              </GlassCard>
            ))}
          </div>
        )}
      </PageLayout>
    </>
  );
};

export default Browse;