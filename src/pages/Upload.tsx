import { useRef, useState, ChangeEvent, DragEvent, FormEvent } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import PageHeader from '@/components/ui/PageHeader';
import { toast } from 'sonner';
import axios from '@/api/axios';
import { CloudUpload } from 'lucide-react';

type RenderStatus = 'pending' | 'processing' | 'complete' | 'failed' | null;

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [webmUrl, setWebmUrl] = useState<string | null>(null);
  const [renderStatus, setRenderStatus] = useState<RenderStatus>(null);
  const dropzoneRef = useRef<HTMLDivElement | null>(null);

  const handleFileChange = (f: File) => {
    if (!f.name.toLowerCase().endsWith('.stl')) {
      toast.error('❌ Only .stl files are supported.');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setWebmUrl(null);
    if (!name) setName(f.name.replace(/\.[^/.]+$/, ''));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFileChange(dropped);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

  const pollRenderStatus = (uploadId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/upload/status/${uploadId}`);
        const status: RenderStatus = res.data.status;
        setRenderStatus(status);

        if (res.data.webm_url) setWebmUrl(res.data.webm_url);

        if (status === 'complete') {
          toast.success('✅ Model render complete');
          clearInterval(interval);
        } else if (status === 'failed') {
          toast.error('❌ Render failed');
          clearInterval(interval);
        }
      } catch {
        toast.error('⚠️ Render status polling failed');
        clearInterval(interval);
      }
    }, 3000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'model');
    formData.append('name', name);
    formData.append('description', description);

    try {
      setUploading(true);
      setUploadProgress(0);

      const res = await axios.post('/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      const { id, webm_url } = res.data;
      if (webm_url) setWebmUrl(webm_url);

      toast.success('✅ Model uploaded successfully');
      pollRenderStatus(id);

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(null);
      setPreviewUrl(null);
      setName('');
      setDescription('');
    } catch {
      toast.error('❌ Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] px-4 py-8 space-y-6">
      <PageHeader
        icon={<CloudUpload className="w-8 h-8 text-zinc-400" />}
        title="Upload Model"
      />

      <GlassCard className="max-w-md w-full p-6 rounded-2xl shadow-xl bg-white/30 dark:bg-zinc-800/30 backdrop-blur-md space-y-4">
        <div
          ref={dropzoneRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-xl text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer hover:border-blue-400 hover:bg-blue-50/20 dark:hover:bg-zinc-700/20 relative overflow-hidden"
          aria-label="File upload drop zone"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 dark:to-black/20 pointer-events-none rounded-xl"></div>
          <p className="z-10">Drag & drop an STL here or click below</p>
          <input
            type="file"
            accept=".stl"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
            }}
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label="File upload input"
          />
        </div>

        {(previewUrl || webmUrl) && (
          <div className="mb-4 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Preview</p>
            <div className="w-40 h-40 mx-auto rounded-xl border border-white/30 dark:border-zinc-700 backdrop-blur-md bg-white/10 dark:bg-zinc-900/20 shadow-inner p-2 overflow-hidden">
              {webmUrl ? (
                <video
                  src={webmUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="object-contain w-full h-full rounded-md"
                />
              ) : (
                <img
                  src={previewUrl!}
                  alt={`Preview of ${name || 'uploaded model'}`}
                  loading="lazy"
                  className="object-contain w-full h-full rounded-md"
                />
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl
                         bg-white/20 dark:bg-zinc-700/40
                         text-zinc-900 dark:text-white
                         placeholder-zinc-500 dark:placeholder-zinc-400
                         backdrop-blur
                         border border-white/30
                         focus:outline-none focus:ring-2 focus:ring-blue-400
                         shadow-inner transition"
              placeholder="Model name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl
                         bg-white/20 dark:bg-zinc-700/40
                         text-zinc-900 dark:text-white
                         placeholder-zinc-500 dark:placeholder-zinc-400
                         backdrop-blur
                         border border-white/30
                         focus:outline-none focus:ring-2 focus:ring-blue-400
                         shadow-inner transition"
              rows={2}
              placeholder="Optional description"
            />
          </div>

          <GlassButton
            type="submit"
            variant={uploading ? 'primary' : 'uploadBlue'}
            size="md"
            loading={uploading}
            disabled={uploading}
            className="w-full"
          >
            Upload Model
          </GlassButton>
        </form>

        {uploading && (
          <div className="mt-4">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-center mt-1 text-zinc-600 dark:text-zinc-300">
              Uploading: {uploadProgress}%
            </p>
          </div>
        )}

        {renderStatus && (
          <div className="mt-4 text-sm text-center text-zinc-600 dark:text-zinc-300">
            <p>
              Render Status: <strong className="capitalize">{renderStatus}</strong>
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
