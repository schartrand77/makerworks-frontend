// src/pages/Upload.tsx

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast, { Toaster } from 'react-hot-toast';
import { uploadAvatar } from '@/api/users';

const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];

const UploadPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rejectedFiles, setRejectedFiles] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections) => {
    setRejectedFiles([]);
    setSelectedFile(null);
    setProgress(0);

    if (!acceptedFiles.length) {
      toast.error('❌ No valid file selected.');
      if (fileRejections.length) {
        const names = fileRejections.map((rej) => rej.file.name);
        setRejectedFiles(names);
      }
      return;
    }

    const file = acceptedFiles[0];
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(ext || '')) {
      toast.error(`❌ Invalid file: ${file.name}. Allowed: ${allowedExtensions.join(', ')}`);
      setRejectedFiles([file.name]);
      return;
    }

    setSelectedFile(file);

    setLoading(true);

    uploadAvatarWithProgress(file)
      .then((res) => {
        if (res) {
          toast.success(`✅ Avatar uploaded: ${res.avatar_url}`);
        }
        setSelectedFile(null);
        setProgress(0);
      })
      .catch(() => {
        toast.error(`❌ Upload failed.`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /**
   * Wrapper to track progress manually
   */
  const uploadAvatarWithProgress = async (file: File) => {
    return new Promise((resolve, reject) => {
      const { token, user } = require('@/store/useAuthStore').useAuthStore.getState();
      if (!token || !user?.id) {
        toast.error('❌ Not authenticated. Please log in.');
        reject(new Error('Not authenticated'));
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const axios = require('@/api/axios').default;

      axios
        .post(
          `/api/v1/avatar?user_id=${user.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
            onUploadProgress: (e: ProgressEvent) => {
              if (e.total) {
                setProgress(Math.round((e.loaded / e.total) * 100));
              }
            },
          }
        )
        .then((res: any) => {
          toast.success('✅ Avatar updated.');
          resolve(res.data);
        })
        .catch((err: any) => {
          console.error('[uploadAvatar] error', err);
          toast.error(
            err?.response?.data?.detail || '❌ Failed to upload avatar.'
          );
          reject(err);
        });
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: loading,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
    },
  });

  return (
    <div
      className="upload-container"
      style={{
        maxWidth: '600px',
        margin: '2rem auto',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <Toaster position="top-right" />

      <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#fff' }}>
        Upload Your Avatar
      </h2>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
        style={{
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          padding: '30px',
          textAlign: 'center',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px) saturate(180%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          color: '#fff',
          transition: 'all 0.3s ease',
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop your avatar here…</p>
        ) : (
          <p>
            Drag & drop an image here or click to select.
            <br />
            <strong>Allowed: png, jpg, jpeg, gif</strong>
          </p>
        )}
      </div>

      {selectedFile && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            color: '#fff',
          }}
        >
          <p>
            📄 <strong>{selectedFile.name}</strong> (
            {(selectedFile.size / 1024).toFixed(1)} KB)
          </p>
          {loading && (
            <div
              style={{
                height: '10px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
                marginTop: '0.5rem',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background:
                    'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          )}
        </div>
      )}

      {loading && (
        <p style={{ textAlign: 'center', marginTop: '1em', color: '#fff' }}>
          Uploading… {progress}%
        </p>
      )}

      {rejectedFiles.length > 0 && (
        <div
          style={{
            color: 'red',
            marginTop: '1em',
            textAlign: 'center',
          }}
        >
          <p>🚫 Rejected files:</p>
          <ul>
            {rejectedFiles.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
