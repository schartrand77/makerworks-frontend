import { useState } from 'react';
import axios from '@/api/axios';
import ModelViewer from '@/components/ui/ModelViewer';
import Spinner from '@/components/ui/Spinner';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [model, setModel] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const f = e.target.files[0];
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setStatus('uploading');
    setProgress(0);

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) {
            setProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      });

      setModel(res.data);
      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 min-h-screen bg-gradient-to-br from-[#f8f9fa]/50 to-[#e9ecef]/30 backdrop-blur rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Upload Model</h1>

      {/* Dropzone */}
      <div className="relative w-full max-w-md p-6 rounded-3xl border border-gray-300/50 bg-white/30 backdrop-blur-md shadow-inner">
        <input
          type="file"
          accept=".stl,.3mf"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="text-center text-gray-700 dark:text-gray-300">
          {file ? (
            <>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </>
          ) : (
            <p className="text-lg">Click or drag file here to upload</p>
          )}
        </div>
      </div>

      {/* Upload Button */}
      {file && (
        <button
          onClick={handleUpload}
          disabled={status === 'uploading'}
          className="px-6 py-2 rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {status === 'uploading' ? 'Uploading…' : 'Upload'}
        </button>
      )}

      {/* Progress Bar */}
      {status === 'uploading' && (
        <div className="w-full max-w-md bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Status */}
      {status === 'error' && (
        <p className="text-red-600 mt-2">❌ Upload failed. Try again.</p>
      )}
      {status === 'done' && model && (
        <p className="text-green-600 mt-2">✅ Upload complete!</p>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="w-full max-w-lg mt-6 rounded-3xl bg-white/20 backdrop-blur-md p-4 shadow-lg">
          <h2 className="text-lg font-medium text-center text-gray-800 dark:text-gray-200 mb-4">
            Preview
          </h2>
          <div className="w-full h-64">
            {model?.glb_url || model?.stl_url ? (
              <ModelViewer
                src={model.glb_url || ''}
                fallbackSrc={model.stl_url || ''}
                color="#999999"
              />
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
