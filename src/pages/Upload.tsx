import { useRef, useState, ChangeEvent, DragEvent, FormEvent } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import GlassNavbar from '@/components/ui/GlassNavbar';
import { toast } from 'sonner';
import axios from '@/api/axios';

type RenderStatus = 'pending' | 'processing' | 'complete' | 'failed' | null;

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [renderStatus, setRenderStatus] = useState<RenderStatus>(null);
  const dropzoneRef = useRef<HTMLDivElement | null>(null);

  const handleFileChange = (f: File) => {
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
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
        if (status === 'complete') {
          toast.success('✅ Model render complete');
          clearInterval(interval);
        } else if (status === 'failed') {
          toast.error('❌ Render failed');
          clearInterval(interval);
        }
      } catch (err) {
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
      const res = await axios.post('/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { id } = res.data;

      toast.success('✅ Model uploaded successfully');
      pollRenderStatus(id);

      setFile(null);
      setPreviewUrl(null);
      setName('');
      setDescription('');
    } catch {
      toast.error('❌ Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <GlassNavbar floating />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <GlassCard>
          <div
            ref={dropzoneRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full border-2 border-dashed border-zinc-400 rounded-lg p-6 text-center dark:border-zinc-600 mb-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            aria-label="File upload drop zone"
          >
            <p className="text-zinc-600 dark:text-zinc-400 mb-2">
              Drag and drop an STL or 3MF file here
            </p>
            <input
              type="file"
              accept=".stl,.3mf"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
              }}
              className="w-full"
              aria-label="File upload input"
            />
          </div>

          {previewUrl && (
            <div className="mb-4 text-center">
              <p className="text-sm mb-2 text-zinc-500">Selected:</p>
              <img
                src={previewUrl}
                alt="Model preview"
                className="w-32 h-32 mx-auto object-contain border border-zinc-300 dark:border-zinc-700 rounded-lg shadow"
              />
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
                className="w-full p-2 border rounded-md dark:bg-zinc-800"
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
                className="w-full p-2 border rounded-md dark:bg-zinc-800"
                rows={3}
                placeholder="Model description (optional)"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-zinc-900 text-white py-2 rounded-md hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-busy={uploading}
            >
              {uploading ? 'Uploading…' : 'Upload Model'}
            </button>
          </form>

          {renderStatus && (
            <div className="mt-6 text-sm text-center text-zinc-700 dark:text-zinc-300">
              <p>
                Render Status:{' '}
                <strong className="capitalize">{renderStatus}</strong>
              </p>
            </div>
          )}
        </GlassCard>
      </div>
    </>
  );
}