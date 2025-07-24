import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '@/api/axios';
import ModelViewer from '@/components/ui/ModelViewer';
import WebmPlayer from '@/components/ui/WebmPlayer';
import GlassCard from '@/components/ui/GlassCard';

interface Model {
  id: string;
  name: string;
  description?: string;
  uploader_username?: string;
  stl_url?: string;
  webm_url?: string;
  thumbnail_url?: string;
}

const ModelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<Model | null>(null);

  useEffect(() => {
    const fetchModel = async () => {
      const res = await axios.get<Model>(`/models/${id}`);
      setModel(res.data);
    };
    fetchModel();
  }, [id]);

  if (!model) {
    return <div className="text-center py-8">Loading model…</div>;
  }

  return (
    <main import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '@/api/axios';
import ModelViewer from '@/components/ui/ModelViewer';
import GlassCard from '@/components/ui/GlassCard';

interface Model {
  id: string;
  name: string;
  description?: string;
  uploader_username?: string;
  stl_url?: string;
  webm_url?: string;
  thumbnail_url?: string;
  created_at?: string;
  updated_at?: string;
  volume_mm3?: number;
  dimensions?: { x: number; y: number; z: number };
  tags?: string[];
}

const ModelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<Model | null>(null);

  useEffect(() => {
    const fetchModel = async () => {
      const res = await axios.get<Model>(`/models/${id}`);
      setModel(res.data);
    };
    fetchModel();
  }, [id]);

  if (!model) {
    return (
      <main className="flex justify-center items-center h-[60vh] text-zinc-500 text-lg">
        Loading model…
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <GlassCard className="glass p-6 sm:p-8 space-y-6">
        <h1 className="text-3xl font-bold">{model.name}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{model.description || 'No description provided.'}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass rounded-xl overflow-hidden shadow-xl">
            {model.stl_url || model.thumbnail_url ? (
              <ModelViewer
                src={model.stl_url || undefined}
                previewImage={model.thumbnail_url || undefined}
                webmVideo={model.webm_url || undefined}
              />
            ) : (
              <div className="flex justify-center items-center h-64 text-zinc-500">
                No 3D preview available
              </div>
            )}
          </div>

          <div className="glass rounded-xl p-4 shadow-xl flex flex-col gap-4 text-sm text-zinc-700 dark:text-zinc-300">
            <div>
              <span className="font-medium">Uploader:</span>{' '}
              {model.uploader_username || 'Anonymous'}
            </div>
            <div>
              <span className="font-medium">Created At:</span>{' '}
              {model.created_at ? new Date(model.created_at).toLocaleString() : '—'}
            </div>
            {model.updated_at && (
              <div>
                <span className="font-medium">Updated At:</span>{' '}
                {new Date(model.updated_at).toLocaleString()}
              </div>
            )}
            {model.volume_mm3 && (
              <div>
                <span className="font-medium">Volume:</span>{' '}
                {(model.volume_mm3 / 1000).toFixed(2)} cm³
              </div>
            )}
            {model.dimensions && (
              <div>
                <span className="font-medium">Dimensions (mm):</span>{' '}
                X: {model.dimensions.x} × Y: {model.dimensions.y} × Z: {model.dimensions.z}
              </div>
            )}
            {model.tags && model.tags.length > 0 && (
              <div>
                <span className="font-medium">Tags:</span>{' '}
                {model.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-zinc-200 dark:bg-zinc-700 text-xs px-2 py-1 rounded-full mr-1 mt-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </main>
  );
};

export default ModelPage;="max-w-5xl mx-auto px-4 py-8">
      <GlassCard className="space-y-4 p-4">
        <h1 className="text-2xl font-bold">{model.name}</h1>
        <p>{model.description}</p>
        {model.uploader_username && (
          <p className="text-sm text-zinc-500">Uploaded by {model.uploader_username}</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {model.stl_url ? (
            <ModelViewer fileUrl={model.stl_url} />
          ) : (
            <div className="text-center text-zinc-500">No 3D preview available</div>
          )}

          {model.webm_url ? (
            <WebmPlayer fileUrl={model.webm_url} />
          ) : (
            <div className="text-center text-zinc-500">No turntable video</div>
          )}
        </div>
      </GlassCard>
    </main>
  );
};

export default ModelPage;
