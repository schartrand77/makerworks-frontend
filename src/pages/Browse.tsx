import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/api/axios';
import GlassCard from '@/components/ui/GlassCard';
import { useAuthStore } from '@/store/useAuthStore';

interface Model {
  id: string;
  name: string;
  description: string;
  thumbnail_url?: string;
}

const Browse: React.FC = () => {
  const [models, setModels] = useState<Model[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<'local' | 'makerworld' | 'thingiverse' | 'printables' | 'thangs'>('local');

  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (source === 'local') {
      fetchModels();
      if (user?.id) fetchFavorites();
    } else {
      redirectToExternal(source);
    }
  }, [source]);

  const fetchModels = async () => {
    try {
      const res = await axios.get<Model[]>('/api/models');
      setModels(res.data);
    } catch (err) {
      console.error('[Browse] Failed to load models:', err);
      setError('⚠️ Failed to load models. Please try again.');
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

  const isLoading = models === null && !error;

  const filteredModels =
    models?.filter(model => {
      const matchesQuery =
        model.name.toLowerCase().includes(query.toLowerCase()) ||
        model.description.toLowerCase().includes(query.toLowerCase());
      return matchesQuery;
    }) || [];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-center">Browse Models</h1>

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
                  <div className="w-full h-40 bg-white/10 flex items-center justify-center rounded-md mb-2 text-sm text-zinc-300">
                    No Thumbnail
                  </div>
                )}

                <h2 className="text-lg font-semibold mb-1">{model.name}</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  {model.description}
                </p>

                <button
                  className="mt-2 w-full py-1.5 rounded-full bg-blue-600/80 hover:bg-blue-500 transition text-white text-sm shadow"
                  onClick={() => handleEstimate(model)}
                >
                  Get Estimate
                </button>
              </GlassCard>
            ))}
        </div>
      )}
    </main>
  );
};

export default Browse;
