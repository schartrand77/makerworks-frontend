import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/api/axios';
import GlassCard from '@/components/ui/GlassCard';
import PageTitle from '@/components/ui/PageTitle';
import { useAuthStore } from '@/store/useAuthStore';

interface Model {
  id: string;
  name: string;
  description: string;
  thumbnail_url?: string;
  uploader_username?: string;
}

const Browse: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 6;
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<'local' | 'makerworld' | 'thingiverse' | 'printables' | 'thangs'>('local');

  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (source === 'local') {
      setModels([]);
      setPage(1);
      setHasMore(true);
      fetchModels(1, limit);
      if (user?.id) fetchFavorites();
    } else {
      redirectToExternal(source);
    }
  }, [source]);

  useEffect(() => {
    if (page > 1 && source === 'local') {
      fetchModels(page, limit);
    }
  }, [page, source]);

  const fetchModels = async (pageParam = 1, limitParam = limit) => {
    if (pageParam > 1) setLoadingMore(true);
    try {
      const res = await axios.get<{ models: Model[] }>('/api/models', {
        params: { page: pageParam, limit: limitParam },
      });
      setModels((prev) =>
        pageParam === 1 ? res.data.models : [...prev, ...res.data.models]
      );
      if (res.data.models.length < limitParam) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('[Browse] Failed to load models:', err);
      setError('⚠️ Failed to load models. Please try again.');
    } finally {
      if (pageParam > 1) setLoadingMore(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await axios.get<string[]>(`/api/users/${user?.id}/favorites`);
      setFavorites(new Set(res.data));
    } catch (err) {
      console.error('[Browse] Failed to load favorites:', err);
    }
  };

  const toggleFavorite = async (id: string) => {
    const isFav = favorites.has(id);
    const updated = new Set(favorites);
    isFav ? updated.delete(id) : updated.add(id);
    setFavorites(updated);

    try {
      if (isFav) {
        await axios.delete(`/api/users/${user?.id}/favorites/${id}`);
      } else {
        await axios.post(`/api/users/${user?.id}/favorites`, { modelId: id });
      }
    } catch (err) {
      console.error('[Browse] Failed to update favorite:', err);
    }
  };

  const handleEstimate = (model: Model) => {
    navigate('/estimate', { state: { model } });
  };

  const redirectToExternal = (platform: string) => {
    const urls: Record<string, string> = {
      makerworld: 'https://makerworld.com',
      thingiverse: 'https://www.thingiverse.com',
      printables: 'https://www.printables.com',
      thangs: 'https://thangs.com',
    };
    window.location.href = urls[platform];
  };

  const isLoading = models.length === 0 && !error;

  const filteredModels =
    models.filter(model => {
      const matchesQuery =
        model.name.toLowerCase().includes(query.toLowerCase()) ||
        model.description.toLowerCase().includes(query.toLowerCase());
      return matchesQuery;
    });

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <PageTitle
        title="Browse Models"
        withDivider
      />

      {error && <div className="text-center text-red-500 py-8">{error}</div>}

      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search models…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-1/2 rounded-full px-4 py-2 backdrop-blur bg-white/20 dark:bg-black/20 border border-white/30 text-sm shadow placeholder:text-zinc-400 focus:outline-none"
        />
        <select
          value={source}
          onChange={(e) => setSource(e.target.value as typeof source)}
          className="w-full sm:w-1/4 rounded-full px-4 py-2 backdrop-blur bg-white/20 dark:bg-black/20 border border-white/30 text-sm shadow focus:outline-none"
        >
          <option value="local">MakerWorks (Local)</option>
          <option disabled>—— External Links ——</option>
          <option value="makerworld">Makerworld</option>
          <option value="thingiverse">Thingiverse</option>
          <option value="printables">Printables</option>
          <option value="thangs">Thangs</option>
        </select>
      </div>

      {source === 'local' && (
        <>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isLoading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <GlassCard key={idx} className="glass">
                <div className="animate-pulse space-y-3">
                  <div className="w-full h-40 bg-white/20 rounded-md" />
                  <div className="h-4 bg-white/20 rounded w-3/4" />
                  <div className="h-3 bg-white/20 rounded w-full" />
                </div>
              </GlassCard>
            ))}
          {!isLoading &&
            filteredModels.map((model) => (
              <GlassCard
                key={model.id}
                className="relative backdrop-blur bg-white/20 dark:bg-black/20 border border-white/20 shadow-lg glass"
              >
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
                  <div className="w-full h-40 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center rounded-md mb-2 text-sm text-zinc-500">
                    No thumbnail available
                  </div>
                )}

                <h2 className="text-lg font-semibold mb-1">{model.name}</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  {model.description}
                </p>

                {model.uploader_username && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                    Uploaded by <span className="font-medium">{model.uploader_username}</span>
                  </p>
                )}

                <button
                  className="mt-2 w-full py-1.5 rounded-full bg-blue-600/80 hover:bg-blue-500 transition text-white text-sm shadow"
                  onClick={() => handleEstimate(model)}
                >
                  Get Estimate
                </button>
              </GlassCard>
            ))}
        </div>
        {hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loadingMore}
              className="px-4 py-2 rounded-full bg-blue-600/80 hover:bg-blue-500 transition text-white text-sm shadow disabled:opacity-50"
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
        </>
      )}
    </main>
  );
};

export default Browse;
